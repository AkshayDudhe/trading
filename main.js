const tbody = document.getElementById('tradesTable')
const bp = document.getElementById('bp')
const sp = document.getElementById('sp')
const qty = document.getElementById('qty')
const profit = document.getElementById('profit')
const netProfit = document.getElementById('netProfit')
const tax = document.getElementById('tax')
const storageKey = 'TRADES'
let index = 0
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
document
  .querySelectorAll('input')
  .forEach((elem) => elem.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      if (event.target.id === 'bp') {
        sp.focus()
      } else if (event.target.id === 'sp') {
        qty.focus()
      } else if (event.target.id === 'qty') {
        addTrade()
      }
    }
  }))
// document
//   .querySelectorAll('td')
//   .forEach((elem) => elem.addEventListener('focusout', (event) => {
//     const parent = event.target.parentElement.children
//     trades[event.target.parentElement.dataset.index] = [parent[0].innerHTML, parent[1].innerHTML, parent[2].innerHTML]
//     window.localStorage.setItem(storageKey, JSON.stringify(trades))
//     location.reload()
//   }))
function addTrade (store = true) {
  const tr = document.createElement('tr')
  tr.dataset.index = index++

  const dBp = document.createElement('td')
  dBp.contentEditable = true
  dBp.appendChild(document.createTextNode(bp.value))

  const dSp = document.createElement('td')
  dSp.contentEditable = true
  dSp.appendChild(document.createTextNode(sp.value))

  const dQty = document.createElement('td')
  dQty.contentEditable = true
  dQty.appendChild(document.createTextNode(qty.value))

  const edit = document.createElement('td')
  // edit.nodeType = 'button'
  edit.classList.add('bi', 'bi-pencil')
  edit.classList.add('button')
  edit.addEventListener('click', (event) => {
    const index = event.target.parentElement.dataset.index
    const parent = event.target.parentElement.children
    if (isNaN(parent[1].innerHTML) || isNaN(parent[1].innerHTML) || isNaN(parent[1].innerHTML)) {
      trades[index] = [parent[1].innerHTML, parent[2].innerHTML, parent[3].innerHTML]
    } else {
      trades.splice(index,1)
    }
    window.localStorage.setItem(storageKey, JSON.stringify(trades))
    location.reload()
  })
  tr.appendChild(edit)

  const [p, t] = cal_options()
  profit.innerHTML = parseFloat(parseFloat(profit.innerHTML) + (p + t)).toFixed(2)
  tax.innerHTML = parseFloat(parseFloat(tax.innerHTML) + t).toFixed(2)
  netProfit.innerHTML = parseFloat(parseFloat(netProfit.innerHTML) + p).toFixed(2)
  // qty.value = ''
  sp.value = ''
  bp.value = ''
  const dPnl = document.createElement('td')
  dPnl.appendChild(document.createTextNode(p))

  const dTax = document.createElement('td')
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
  let bp = parseFloat(parseFloat(document.getElementById('bp').value).toFixed(2))
  let sp = parseFloat(parseFloat(document.getElementById('sp').value).toFixed(2))
  const qty = parseFloat(parseFloat(document.getElementById('qty').value).toFixed(2))

  if (isNaN(qty) || (isNaN(bp) && isNaN(sp))) {
    window.alert(`missing value\n Buy: ${bp} | Sell: ${sp} | Qty: ${qty}`)
    return
  }

  let brokerage = 40

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
