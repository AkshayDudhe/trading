const tbody = document.getElementById('tradesTable')
const bp = document.getElementById('bp')
const sp = document.getElementById('sp')
const qty = document.getElementById('qty')
const profit = document.getElementById('profit')
const netProfit = document.getElementById('netProfit')
const tax = document.getElementById('tax')
const storageKey = 'TRADES'
let trades = JSON.parse(window.localStorage.getItem(storageKey))
if (trades) {
  trades.forEach(trade => {
    bp.value = trade[0]
    sp.value = trade[1]
    qty.value = trade[2]
    addTrade(false)
  })
} else {
  trades = []
}
qty.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTrade()
  }
})

function addTrade (store = true) {
  const tr = document.createElement('tr')

  const dBp = document.createElement('td')
  dBp.appendChild(document.createTextNode(bp.value))

  const dSp = document.createElement('td')
  dSp.appendChild(document.createTextNode(sp.value))

  const dQty = document.createElement('td')
  dQty.appendChild(document.createTextNode(qty.value))
  const [p, t] = cal_options()
  profit.innerHTML = parseFloat(parseFloat(profit.innerHTML) + p).toFixed(2)
  tax.innerHTML = parseFloat(parseFloat(tax.innerHTML) + t).toFixed(2)
  netProfit.innerHTML = parseFloat(parseFloat(netProfit.innerHTML) + (p - t)).toFixed(2)
  // qty.value = ''
  sp.value = ''
  bp.value = ''
  const dPnl = document.createElement('td')
  const dTax = document.createElement('td')
  dPnl.appendChild(document.createTextNode(p))

  dTax.appendChild(document.createTextNode(t))

  tr.append(dBp, dSp, dQty, dPnl, dTax)
  if (p > 0) {
    tr.classList.add('table-success')
  } else {
    tr.classList.add('table-danger')
  }
  tbody.prepend(tr, tbody.firstChild)
  bp.focus()
  // LocalStorage
  if (store) {
    trades.push([dBp.innerHTML, dSp.innerHTML, dQty.innerHTML])
    window.localStorage.setItem(storageKey, JSON.stringify(trades))
  }
  // tbody.insertBefore(tr, tbody.firstChild)
  // tbody.append(tr)
}

function cal_options () {
  const bp = parseFloat(parseFloat(document.getElementById('bp').value).toFixed(2))
  const sp = parseFloat(parseFloat(document.getElementById('sp').value).toFixed(2))
  const qty = parseFloat(parseFloat(document.getElementById('qty').value).toFixed(2))

  if (isNaN(qty) || (isNaN(bp) && isNaN(sp))) {
    return
  }

  const brokerage = 40

  if (isNaN(bp) || bp === 0) {
    bp = 0
    bse_tran_charge_buy = 0
    brokerage = 20
  }
  if (isNaN(sp) || sp === 0) {
    sp = 0
    bse_tran_charge_sell = 0
    brokerage = 20
  }

  const turnover = parseFloat(parseFloat((bp+sp)*qty).toFixed(2))

  const stt_total = Math.round(parseFloat(parseFloat(sp * qty * 0.0005).toFixed(2)))

  const etc = parseFloat(parseFloat(0.00053*turnover).toFixed(2))

  const stax = parseFloat(parseFloat(0.18 * (brokerage + etc)).toFixed(2))

  let sebi_charges = parseFloat(parseFloat(turnover*0.000001).toFixed(2))
  sebi_charges = parseFloat(parseFloat(sebi_charges + (sebi_charges * 0.18)).toFixed(2))

  const stamp_charges = Math.round(parseFloat(parseFloat(bp*qty*0.00003).toFixed(2)))

  const total_tax = parseFloat(parseFloat(brokerage + stt_total + etc + stax + sebi_charges + stamp_charges).toFixed(2))

  let breakeven = parseFloat(parseFloat(total_tax / qty).toFixed(2))
  breakeven = isNaN(breakeven) ? 0 : breakeven

  const net_profit = parseFloat(parseFloat(((sp - bp) * qty) - total_tax).toFixed(2))

  return [net_profit, total_tax]
}

function clean () {
  window.localStorage.removeItem(storageKey)
  location.reload()
}