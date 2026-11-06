const User = require('../models/user.model')
const Manual = require('../models/manual.model')
const Transaction = require('../models/transaction.model')
const Withdrawal = require('../models/withdrawal.model')
const crypto = require('crypto')
const {
  getJson,
  setJson,
  getRepPortalVersion,
  invalidateRepPortal
} = require('../util/redis')

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FEE_RATE = 1.37
const REP_CACHE_TTL_SECONDS = 30

const cachedRepResponse = async (repId, name, load) => {
  const version = await getRepPortalVersion(repId)
  const key = `rep:portal:${repId}:${name}:${version}`
  const cached = await getJson(key)
  if (cached !== null) return cached

  const response = await load()
  await setJson(key, response, REP_CACHE_TTL_SECONDS)
  return response
}

const repManualIds = async repId => {
  const manuals = await Manual.find({ addedBy: repId })
    .select('_id courseCode courseTitle printedStock claimedCount')
    .lean()
  return manuals
}

const repTransactions = async repId => {
  return cachedRepResponse(repId, 'transactions', async () => {
    const manuals = await repManualIds(repId)
    const ids = manuals.map(manual => manual._id)
    const transactions = await Transaction.find({
      manual: { $in: ids },
      status: 'PAID'
    })
      .sort({ paymentDate: -1, createdAt: -1 })
      .populate('student', 'fullName matricNumber department level')
      .populate('manual', 'courseCode courseTitle printedStock claimedCount')
      .lean()
    return { manuals, transactions }
  })
}

const getWithdrawals = async repId => {
  return Withdrawal.find({ representative: repId })
    .sort({ createdAt: -1 })
    .lean()
}

const getFinancialSummary = (transactions, withdrawals) => {
  const grossSales = transactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  )
  const systemDeduction = grossSales * (FEE_RATE / 100)
  const totalWithdrawn = withdrawals
    .filter(withdrawal => withdrawal.status !== 'Failed')
    .reduce((total, withdrawal) => total + Number(withdrawal.amount || 0), 0)

  return {
    grossSales,
    systemDeduction,
    systemDeductionRate: FEE_RATE,
    totalWithdrawn,
    availableBalance: Math.max(
      0,
      grossSales - systemDeduction - totalWithdrawn
    )
  }
}

const settlementAccount = user => {
  const account = user.settlementAccount || {}
  return {
    accountName: account.accountName || 'Not configured',
    bankName: account.bankName || 'Not configured',
    accountNumber: account.accountNumber || '',
    bankCode: account.bankCode || undefined,
    isVerified: Boolean(account.accountNumber)
  }
}

const activityFromTransaction = transaction => ({
  id: String(transaction._id),
  type:
    transaction.dispatchStatus === 'CLAIMED'
      ? 'manual_collected'
      : 'payment_confirmed',
  title:
    transaction.dispatchStatus === 'CLAIMED'
      ? 'Manual collected'
      : 'Payment confirmed',
  subtitle: `${transaction.courseCode} · ${
    transaction.student?.fullName || transaction.matricNumber
  }`,
  timestamp: new Date(
    transaction.paymentDate || transaction.createdAt
  ).toLocaleString('en-NG'),
  color: transaction.dispatchStatus === 'CLAIMED' ? 'purple' : 'green'
})


const dashboard = async (req, res) => {
  try {
    const response = await cachedRepResponse(
      req.user._id,
      'dashboard',
      async () => {
      const { manuals, transactions } = await repTransactions(req.user._id)
      const withdrawals = await getWithdrawals(req.user._id)
      const financials = getFinancialSummary(transactions, withdrawals)
      const today = new Date()
      const confirmedToday = transactions.filter(transaction => {
        const date = new Date(transaction.paymentDate || transaction.createdAt)
        return date.toDateString() === today.toDateString()
      }).length
      const unclaimed = transactions.filter(
        transaction => transaction.dispatchStatus !== 'CLAIMED'
      ).length
      const weeklyConfirmations = Array.from({ length: 7 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - index))
        return {
          day: DAYS[date.getDay()],
          count: transactions.filter(transaction => {
            const transactionDate = new Date(
              transaction.paymentDate || transaction.createdAt
            )
            return transactionDate.toDateString() === date.toDateString()
          }).length
        }
      })

      return {
        ...financials,
        settlementAccount: settlementAccount(req.user),
        confirmedToday,
        keycodesIssued: transactions.length,
        awaitingPickup: unclaimed,
        manualsDistributed: transactions.filter(
          transaction => transaction.dispatchStatus === 'CLAIMED'
        ).length,
        weeklyConfirmations,
        recentActivity: transactions.slice(0, 5).map(activityFromTransaction),
        distributionProgress: manuals.map(manual => {
          const total = Number(manual.printedStock || 0)
          const distributed = Number(manual.claimedCount || 0)
          return {
            courseCode: manual.courseCode,
            courseTitle: manual.courseTitle,
            distributed,
            total,
            percentage: total
              ? Math.min(100, Math.round((distributed / total) * 100))
              : 0
          }
        })
      }
    }
    )
    return res.json(response)
  } catch (error) {
    console.error('Error loading representative dashboard:', error)
    return res
      .status(500)
      .json({ message: 'Unable to load representative dashboard.' })
  }
}

const students = async (req, res) => {
  try {
    const search = String(req.query.search || '')
      .trim()
      .toLowerCase()
    const data = await cachedRepResponse(req.user._id, 'students', async () => {
      const { manuals } = await repTransactions(req.user._id)
      const manualIds = manuals.map(manual => manual._id)
      const transactions = await Transaction.find({
        manual: { $in: manualIds },
        status: 'PAID'
      })
        .select('student keycode dispatchStatus')
        .lean()

      const studentIds = [
        ...new Set(transactions.map(transaction => String(transaction.student)))
      ]
      const users = await User.find({ _id: { $in: studentIds }, role: 'student' })
        .select('fullName matricNumber department level updatedAt')
        .lean()

      return users.map(student => {
        const records = transactions.filter(
          transaction => String(transaction.student) === String(student._id)
        )
        return {
          id: String(student._id),
          name: student.fullName,
          matric: student.matricNumber,
          department: student.department,
          level: student.level,
          manualsCount: records.length,
          keycodesCount: records.filter(record => record.keycode).length,
          status: 'Active'
        }
      })
    })
    return res.json(data.filter(
        student =>
          !search ||
          [student.name, student.matric, student.department].some(value =>
            value.toLowerCase().includes(search)
          )
      ))
  } catch (error) {
    console.error('Error loading representative students:', error)
    return res.status(500).json({ message: 'Unable to load students.' })
  }
}

const settlement = async (req, res) => {
  try {
    const response = await cachedRepResponse(req.user._id, 'settlement', async () => {
      const { transactions } = await repTransactions(req.user._id)
    const withdrawals = await getWithdrawals(req.user._id)
    const financials = getFinancialSummary(transactions, withdrawals)
    
    const transactionRows = transactions.map(transaction => ({
      id: String(transaction._id),
      paystackRef: transaction.reference,
      studentName: transaction.student?.fullName || '',
      matric: transaction.matricNumber,
      courseCode: transaction.courseCode,
      courseTitle: transaction.manual?.courseTitle || '',
      amount: transaction.amount,
      date: transaction.paymentDate || transaction.createdAt,
      keycode: transaction.keycode
    }))
      return {
      ...financials,
      totalTransactions: transactions.length,
      settlementAccount: settlementAccount(req.user),
      withdrawalHistory: withdrawals.map(withdrawal => ({
        id: String(withdrawal._id),
        reference: withdrawal.reference,
        bankName: withdrawal.bankName,
        accountNumber: withdrawal.accountNumber,
        accountName: withdrawal.accountName,
        amount: withdrawal.amount,
        dateTime: withdrawal.createdAt,
        status: withdrawal.status
      })),
      transactions: transactionRows
      }
    })
    return res.json(response)
  } catch (error) {
    console.error('Error loading representative settlement:', error)
    return res
      .status(500)
      .json({ message: 'Unable to load settlement details.' })
  }
}

const withdraw = async (req, res) => {
  const amount = Number(req.body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ message: 'A valid positive withdrawal amount is required.' })
  }

  try {
    const { transactions } = await repTransactions(req.user._id)
    const withdrawals = await getWithdrawals(req.user._id)
    const { availableBalance } = getFinancialSummary(transactions, withdrawals)

    const account = req.user.settlementAccount || {}
    if (!account.accountNumber || !account.bankName || !account.accountName) {
      return res
        .status(400)
        .json({
          message:
            'Configure and verify a settlement account before withdrawing.'
        })
    }

    if (amount > availableBalance) {
      return res
        .status(400)
        .json({ message: 'Withdrawal amount exceeds your available balance.' })
    }

    const withdrawal = await Withdrawal.create({
      representative: req.user._id,
      reference: `WD-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
      amount,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName
    })
    await invalidateRepPortal(req.user._id)

    return res.status(201).json({
      id: String(withdrawal._id),
      reference: withdrawal.reference,
      bankName: withdrawal.bankName,
      accountNumber: withdrawal.accountNumber,
      accountName: withdrawal.accountName,
      amount: withdrawal.amount,
      dateTime: withdrawal.createdAt,
      status: withdrawal.status
    })
  } catch (error) {
    console.error('Error creating representative withdrawal:', error)
    return res
      .status(500)
      .json({ message: 'Unable to create withdrawal request.' })
  }
}

const reports = async (req, res) => {
  const response = await cachedRepResponse(req.user._id, 'reports', () =>
    dashboardData(req)
  )
  return res.json({
    grossSales: response.grossSales,
    deductions: response.systemDeduction,
    deductionRate: response.systemDeductionRate,
    withdrawn: response.totalWithdrawn,
    available: response.availableBalance,
    manualPerformance: response.distributionProgress.map(item => ({
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      percentage: item.percentage
    }))
  })
}

const dashboardData = async req => {
  const { manuals, transactions } = await repTransactions(req.user._id)
  const withdrawals = await getWithdrawals(req.user._id)
  const financials = getFinancialSummary(transactions, withdrawals)
  return {
    ...financials,
    distributionProgress: manuals.map(manual => ({
      courseCode: manual.courseCode,
      courseTitle: manual.courseTitle,
      percentage: manual.printedStock
        ? Math.min(
            100,
            Math.round((manual.claimedCount / manual.printedStock) * 100)
          )
        : 0
    }))
  }
}

const history = async (req, res) => {
  const { transactions } = await repTransactions(req.user._id)
  return res.json(transactions.map(activityFromTransaction))
}

const messages = async (req, res) => {
  if (req.method === 'GET') return res.json([])
  return res.status(501).json({ message: 'Messaging is not available yet.' })
}

module.exports = {
  dashboard,
  students,
  settlement,
  reports,
  history,
  messages,
  withdraw
}
