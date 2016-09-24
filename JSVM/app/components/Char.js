import React from 'react'
import classNames from 'classnames'


const Char = ({char}) => (
    <div className={classNames('char', {'char-nl': char === "\n"})}>{char}</div>
)

export default Char
