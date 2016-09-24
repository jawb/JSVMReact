import React from 'react'

import Controllers from 'app/components/Controllers'
import CodeScroll from 'app/components/CodeScroll'
import SymbolTable from 'app/components/SymbolTable'
import Stack from 'app/components/Stack'
import Terminal from 'app/components/Terminal'


const Executer = () => (
    <div className="executer">
        <Controllers />
        <div className="interfaces">
            <CodeScroll />
            <div className="interfaces-flex-column">
                <div className="interfaces-flex-row">
                    <SymbolTable />
                    <Stack />
                </div>
                <Terminal />
            </div>
        </div>
    </div>
)

export default Executer

