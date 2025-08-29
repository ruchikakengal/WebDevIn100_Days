function navbar() {
    return `
    <div id="navbartop1">
        <div id="navleft1">
            <div> <a href= "index.html"><img src="https://www.1mg.com/images/tata_1mg_logo.svg" alt=""></a></div>
            <div>
                <h4>MEDICINES</h4>
            </div>
            <div>
                <h4>LAB TESTS</h4>
            </div>
            <div>
                <h4>CONSULT DOCTORS</h4>
            </div>
            <div>
                <h4>COVID-19</h4>
            </div>
            <div>
                <h4>AYURVEDA</h4>
            </div>
            <div>
                <h4>CARE PLAN</h4>
            </div>
        </div>
        

        <div id="navright1">
            <div>
                <a class ="userlogo" href="login.html"><h5 id="userlog">Login | Sign Up</h5></a>
                <img src="https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png" alt="" id="userimg">
            </div>
            <div>
                <h5>Offers</h5>
            </div>
            <div>
                <a href="cart.html">
                    <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/009/157/893/small/shopping-cart-set-of-shopping-cart-icon-on-white-background-shopping-cart-icon-shopping-cart-design-shopping-cart-icon-sign-shopping-cart-icon-isolated-shopping-cart-symbol-free-vector.jpg"
                    alt="">
                </a>
            </div>
            <div>
                <h5>Need Help? 
                    
                </h5>
                
            </div>
        </div>
    </div>
    <div id="inputnav1">
        <div id="inputnavright1">
            <div>
                <select id="city" name="city">
                    <option value="New Delhi"> New Delhi</option>
                    <option value="Alipur">Alipur</option>
                    <option value="Bawana">Bawana</option>
                    <option value="Central Delhi">Central Delhi</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Deoli">Deoli</option>
                    <option value="East Delhi">East Delhi</option>
                    <option value="Karol Bagh">Karol Bagh</option>
                    <option value="Najafgarh">Najafgarh</option>
                    <option value="Nangloi Jat">Nangloi Jat</option>
                    <option value="Narela">Narela</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="North Delhi">North Delhi</option>
                    <option value="North East Delhi">North East Delhi</option>
                    <option value="North West Delhi">North West Delhi</option>
                    <option value="Pitampura">Pitampura</option>
                    <option value="Rohini">Rohini</option>
                    <option value="South Delhi">South Delhi</option>
                    <option value="South West Delhi">South West Delhi</option>
                    <option value="West Delhi">West Delhi</option>
                </select>
            </div>
            <div>
               
                <input type="text" id="searchnav" placeholder="Search for Medicines and Health Products">
                <div id="suggestion1"></div>
            </div>
        </div>
        <div id="inputnavleft1">
            <div>
                <p>⚡ QUICK BUY! Get 15% off on medicines*</p>
            </div>
            <div>
                <button>Quick order</button>
            </div>
        </div>
    </div>
    `;
  }
  export  {navbar};