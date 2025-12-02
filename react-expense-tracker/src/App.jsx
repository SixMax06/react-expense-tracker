import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import Graph from './react-components/Graph'
import Expense from './react-components/Expense.jsx'

const makeGET_expenses = async() => {
  const db = new PocketBase('http://127.0.0.1:8090')
  let records = await db.collection('expenses').getFullList()
  return records.map(record => ({ id: record.id, title: record.title, description: record.description, price: record.price, category: record.category }))
}

const makeGET_categories = async() => {
  const db = new PocketBase('http://127.0.0.1:8090')
  let records = await db.collection('expenses_categories').getFullList()
  return records.map(record => [ record.id, record.name ])
}

const makePOST = async(event, title, description, price, category) => {
  event.preventDefault()
  const db = new PocketBase('http://127.0.0.1:8090')
  console.log('Connected to PocketBase')
  let newExpense = {
    "title": title,
    "description": description,
    "price": price,
    "category": category
  }
  console.log('Posting expense')
  await db.collection('expenses').create(newExpense)
  console.log('Created record')
}

const App = () => {
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchData = async() => {
      const records = await makeGET_expenses()
      setData(records)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchCategories = async() => {
      const categories = await makeGET_categories()
      setCategoryList(categories)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async(event) => {
    await makePOST(event, title, description, price, category)

    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('')

    const records = await makeGET_expenses()
    setData(records)
  }

  const findCategoryName = (categoryID) => {
    for (let i = 0; i < categoryList.length; i++) {
      if (categoryList[i][0] === categoryID) {
        console.log('Found category name:', categoryList[i][1])
        return categoryList[i][1]
      }
    }
    return 'Unknown'
  }

  return (
    <>
      <div className="add-expense">
        <form className="add-bar" onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input type="text" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <input type="number" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
          <input type="text" placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
          <button type="submit">Add Expense</button>
        </form>
      </div>

      <div className="expenses-list">
        {data.map(element => {
          return (<Expense 
            key={element.id}
            att_ID={element.id} 
            att_title={element.title} 
            att_description={element.description} 
            att_price={element.price} 
            att_category={findCategoryName(element.category)} 
          />)
        })}
      </div>
    </>
  )
}

export default App
