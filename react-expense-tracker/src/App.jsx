import { useEffect, useState } from 'react'
import PocketBase from 'pocketbase'
import './App.css'
import Graph from './react-components/Graph'
import Expense from './react-components/Expense.jsx'

const makeFetch = async() => {
  const db = new PocketBase('http://127.0.0.1:8090')
  let records = await db.collection('expenses').getFullList()
  records = records.map(record => ({id: record.id, title: record.title, description: record.description, price: record.price, category: record.category}))
  console.log(records)
  return records
}

const App = () => {

  let [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const records = await makeFetch()
      setData(records)
      console.log(records)
    }
    fetchData()
  }, [])

  return (
    <>
      <div className="App">
        {data.map(element => {
          return (<Expense 
            key={element.id}
            att_ID={element.id} 
            att_title={element.title} 
            att_description={element.description} 
            att_price={element.price} 
            att_category={element.category} 
          />)
        })}
      </div>
    </>
  )
}

export default App
