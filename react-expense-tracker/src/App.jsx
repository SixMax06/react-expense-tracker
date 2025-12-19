import { useCallback, useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import Graph from './react-components/Graph'
import Expense from './react-components/Expense.jsx'

//La logica del programma è stata scritta interamente da me con qualche aiuto da AI per la risoluzione di bug

const makeGET_expenses = async () => {
  const db = new PocketBase('http://127.0.0.1:8090')
  let records = await db.collection('expenses').getFullList()
  return records.map(record => ({ id: record.id, title: record.title, description: record.description, price: record.price, category: record.category }))
}

const makeGET_categories = async () => {
  const db = new PocketBase('http://127.0.0.1:8090')
  let records = await db.collection('expenses_categories').getFullList()
  return records.map(record => ({ id: record.id, name: record.name }))
}

const makePOST_create = async (event, title, description, price, category) => {
  event.preventDefault()
  const db = new PocketBase('http://127.0.0.1:8090')

  let newExpense = {
    "title": title,
    "description": description,
    "price": price,
    "category": category
  }

  await db.collection('expenses').create(newExpense)
}

const makePOST_update = async (event, title, description, price, category, ID) => {
  event.preventDefault()
  const db = new PocketBase('http://127.0.0.1:8090')

  let newExpense = {
    "title": title,
    "description": description,
    "price": price,
    "category": category
  }

  await db.collection('expenses').update(ID, newExpense)
}

const App = () => {
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [totalList, setTotalList] = useState({})

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await makeGET_categories()
      setCategoryList(categories)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const records = await makeGET_expenses()
      setData(records)
    }
    fetchData()
  }, [categoryList])

  const findCategoryName = useCallback((categoryID) => {
    for (let i = 0; i < categoryList.length; i++)
      if (categoryList[i].id === categoryID)
        return categoryList[i].name

    return 'Unknown'
  }, [categoryList])

  const findCategoryID = useCallback((categoryName) => {
    for (let i = 0; i < categoryList.length; i++)
      if (categoryList[i].name == categoryName)
        return categoryList[i].id

    return '-1'
  }, [categoryList])

  useEffect(() => {
    const getTotals = () => {
      let totals = {}
      for (let i = 0; i < data.length; i++) {
        const catID = findCategoryName(data[i].category)
        const price = parseFloat(data[i].price)
        if (totals[catID]) totals[catID] += price
        else totals[catID] = price
      }
      setTotalList(totals)
    }
    getTotals()
  }, [data, findCategoryName])

  const handleSubmit = (event) => {
    makePOST_create(event, title, description, price, findCategoryID(category))
      .then(() => { const records = makeGET_expenses(); return records })
      .then((records) => { setData(records) })

    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('')
  }

  const handleModify = (event) => {
    makePOST_update(event, title, description, price, findCategoryID(category), event.target.id)
      .then(() => { const records = makeGET_expenses(); return records })
      .then((records) => { setData(records) })

    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('')
  }

  const handleDelete = (event) => {
    const IDExpense = event.target.id
    const db = new PocketBase('http://127.0.0.1:8090')
    db.collection('expenses').delete(IDExpense)
      .then(() => { const records = makeGET_expenses(); return records })
      .then((records) => { setData(records) })
  }


  //Da qui in poi le classi dei tag sono state scritte da Deepseek
  return (
    <div className="app-container">
      {/* Left column - Content */}
      <div className="content-column">
        <div className="add-expense">
          <form className="add-bar" onSubmit={handleSubmit}>
            <div id="inputs-div">
              <input type="text" className="input" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
              <input type="text" className="input" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
              <input type="number" className="input" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
              <input type="text" className="input" placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />

            </div>
            <button type="submit" id="form-submit" className="btn">Add Expense</button>
          </form>
        </div>

        <div className="expenses-container">
          <div className="expenses-header">
            <h2>Your Expenses</h2>
            <span className="expenses-count">{data.length} items</span>
          </div>

          <div className="expenses-scroll-container">
            {data.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>No Expenses Yet</h3>
                <p>Add your first expense to get started! Expenses will appear in a 2-column grid layout.</p>
              </div>
            ) : (
              <div className="expenses-list">
                {data.map(element => {
                  const categoryName = findCategoryName(element.category);
                  return (
                    <div
                      key={element.id}
                      className="expense-item"
                      data-category={categoryName}
                    >
                      <Expense
                        att_ID={element.id}
                        att_title={element.title}
                        att_description={element.description}
                        att_price={element.price}
                        att_category={categoryName}
                        className="expense-card"
                      />
                      <div className="action-buttons">
                        <button id={element.id} className="btn" onClick={handleModify}>Modify</button>
                        <button id={element.id} className="btn" onClick={handleDelete}>Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column - Empty/Sidebar */}
      <div className="sidebar-column">
        <div className="sidebar-placeholder">
          {data.length === 0 ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3>Analytics Dashboard</h3>
              <p>Your expense statistics and charts will appear here. Add some expenses to see insights!</p>
            </>
          ) : (
            <Graph {...totalList} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
