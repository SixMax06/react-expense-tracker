import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import Graph from './react-components/Graph'
import Expense from './react-components/Expense.jsx'

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

const makePOST = async(event, title, description, price, category, ID='') => {
  event.preventDefault()
  const db = new PocketBase('http://127.0.0.1:8090')

  let newExpense = {
    "title": title,
    "description": description,
    "price": price,
    "category": category
  }

  if (ID === "") await db.collection('expenses').create(newExpense)
  else await db.collection('expenses').update(ID, newExpense)
}

const App = () => {
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

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

  const findCategoryName = (categoryID) => {
    for (let i = 0; i < categoryList.length; i++)
      if (categoryList[i].id === categoryID)
        return categoryList[i].name
      
    return 'Unknown'
  }

  const findCategoryID = (categoryName) => {
    for (let i = 0; i < categoryList.length; i++)
      if (categoryList[i].name == categoryName)
        return categoryList[i].id

    return '-1'
  }

  const handleSubmit = (event) => {
    makePOST(event, title, description, price, findCategoryID(category))
    .then(() => {const records = makeGET_expenses(); return records})
    .then((records) => {setData(records)} )

    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('')
  }

  const handleModify = (event) => { 
    makePOST(event, title, description, price, findCategoryID(category), event.target.id)
    .then(() => {const records = makeGET_expenses(); return records})
    .then((records) => {setData(records)} )

    setTitle('')
    setDescription('')
    setPrice('')
    setCategory('')
  }

  const handleDelete = (event) => { 
    const IDExpense = event.target.id
    const db = new PocketBase('http://127.0.0.1:8090')
    db.collection('expenses').delete(IDExpense)
    .then(() => {const records = makeGET_expenses(); return records})
    .then((records) => {setData(records)} )
  }

  return (
    <>
      <div className="add-expense">
        <form className="add-bar" onSubmit={handleSubmit}>
          <div id="inputs-div">
            <input type="text" className="input" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <input type="text" className="input" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} /> <br />
            <input type="number" className="input" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
            <input type="text" className="input" placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
          </div>
          <button type="submit" id="form-submit" className="btn">Add Expense</button>
        </form>
      </div>

      <div className="expenses-list">
        {data.map(element => {
          return (<>
            <Expense
              key={element.id}
              att_ID={element.id}
              att_title={element.title}
              att_description={element.description}
              att_price={element.price}
              att_category={findCategoryName(element.category)}
            />
            <button key={element.id + '_modifybtn'} id={element.id} className="btn" onClick={handleModify}>Modify</button>
            <button key={element.id + '_deletebtn'} id={element.id} className="btn" onClick={handleDelete}>Delete</button>
          </>)
        })}
      </div>
    </>
  )
}

export default App
