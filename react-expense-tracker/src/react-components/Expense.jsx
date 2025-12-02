import { useState } from 'react'
import '../App.css'

const Expense = ( {att_ID, att_title, att_description, att_price, att_category} ) => {
    const [ID, setID] = useState(att_ID)
    const [title, setTitle] = useState(att_title)
    const [description, setDescription] = useState(att_description)
    const [price, setPrice] = useState(att_price)
    const [category, setCategory] = useState(att_category)

    return (
        <div className="expense-card">
            <h2>{title}</h2>
            <h3>{description}</h3>
            <p>Price: ${price}</p>
            <p>Category: {category}</p>
        </div>
    )
}

export default Expense