import React from 'react'
import './Footer.css'

import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintrest_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>Urbaneclat</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
            {/* <img src={instagram_icon} alt="" /> */}
            <a href="https://www.instagram.com/urbaneclat_?igsh=MThraDA1YmRwYmliOQ== ">
              <img src={instagram_icon} alt="" />  
            </a>

        </div>
        <div className="footer-icons-container">
          <a href=" https://pin.it/NcqoPwDT8 ">
            <img src={pintrest_icon} alt="" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a href="https://chat.whatsapp.com/DbydqwMnncNG0sv1B8ZKuH">
            <img src={whatsapp_icon} alt="" />
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2023 - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
