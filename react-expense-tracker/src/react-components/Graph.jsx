import { useState } from 'react'
import { BarChart, Bar, XAxis } from 'recharts';
import '../App.css'

//File scritto interamente da me con qualche aiuto da AI per la risoluzione di bug

const convertToUsableData = (rawData) => {
    return Object.keys(rawData).map(key => ({ name: key, standard: rawData[key] }))
}

const Graph = (data) => {
    return (
        <BarChart
            style={{ width: '500px', maxWidth: '300px', maxHeight: '100px', aspectRatio: 1.618 }}
            responsive
            data={convertToUsableData(data)}
        >
            <XAxis dataKey="name" />
            <Bar dataKey="standard" fill="#8884d8" />
        </BarChart>
    );
}

export default Graph
