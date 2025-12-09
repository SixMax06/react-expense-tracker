import { useState } from 'react'
import '../App.css'

const Expense = ({ att_ID, att_title, att_description, att_price, att_category }) => {
    const [ID, _] = useState(att_ID)
    return (
        <div className="expense-card card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-gray-800">
                    {att_title}
                </h2>
                <h3 className="text-gray-600 mb-4">{att_description}</h3>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-emerald-600">
                            ${att_price}
                        </span>
                        <span className="badge badge-outline badge-primary">{att_category}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Expense