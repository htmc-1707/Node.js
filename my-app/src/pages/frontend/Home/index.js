

import React from 'react';
import ProductList from '../Product/ProductList';
import Banner from './banner';
import Slider from './slider';


function Home() {
     document.title="Home"
    return ( 
<>
  
  {/* Cart */}

  {/* Slider */}
      <Slider
      />
      <div className="p-b-10">
        <h3 className="ltext-103 cl5" style={{ fontFamily: 'Arial, sans-serif', fontSize: '28px', fontWeight: 'bold' }}>Dịch vụ</h3>
      </div>
  {/* Banner */}
 <Banner/>  
  
 
  {/* Product */}
  <section className="bg0 p-t-23 p-b-130">
    <div className="container">
      <div className="p-b-10">
        <h3 className="ltext-103 cl5" style={{ fontFamily: 'Arial, sans-serif', fontSize: '28px', fontWeight: 'bold' }}>Sản phẩm mới</h3>
      </div>
 
     <ProductList></ProductList>
     
      {/* Pagination */}
    
    </div>
  </section>
  {/* Footer */}
 
  {/* Back to top */}
  <div className="btn-back-to-top" id="myBtn">
    <span className="symbol-btn-back-to-top">
      <i className="zmdi zmdi-chevron-up" />
    </span>
  </div>
  {/* Modal1 */}

 
</>




     );
}
 
export default Home;