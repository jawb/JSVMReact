import React from 'react'


const Footer = ({date}) => (
    <div className="footer">
        <hr className="footer-line" />
        <p>{`© JSVM ${date}`}</p>
    </div>
)

export default Footer
