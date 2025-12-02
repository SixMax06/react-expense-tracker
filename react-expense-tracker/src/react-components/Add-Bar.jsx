import { useState } from 'react'
import '../App.css'

const AddBar = ( {handleSubmit} ) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')

    return (
        <form className="add-bar" onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            <input type="text" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} required />
            <input type="text" placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} required />
            <button type="submit">Add Expense</button>
        </form>
    )
}

export default AddBar