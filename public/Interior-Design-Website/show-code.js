// to top
window.addEventListener('scroll', function(){
    var scroll = document.querySelector('.up');
    scroll.classList.toggle("active", window.scrollY > window.innerHeight)
})
function totop(){
    window.scrollTo({
        top: 0
    })
}


function imclk(sc){
    window.open(document.getElementById(sc).src, '_blank');
}
function getquote(quote){
    window.open(`book.html?name=${document.getElementById(quote).textContent.split(" ").join("+")}`, '_self');
}

// main func
window.addEventListener('load' , () => {
    const params = (new URL(document.location)).searchParams;
    const topic = params.get('topic');
    if (topic == 'living-room'){
        document.getElementById('head-title').textContent = "LIVING ROOM INTERIOR";
        document.getElementById('title').textContent = "You never get a second chance to make a first impression. So, your home's first room, the living room, should be spectacular! Browse through our wide range of living room designs to steal some inspiration...";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-living-room.jpg')";
        const namelist = ["", "Luxury Living Room With Brown Textured Wallpaper And Metal Hangings", "Spacious Living Room With Traditional Touch", "Small Living Room With Minimal Furniture", "Spacious Living Room With Cream And Green Tones", "Modern Spacious Living Room With Neutral Palette", "Small Living Room Will A Wall With Photo Frames", "Small Living Room With Mint Green Wall", "Spacious Living Room With Light Tones", "Small Living Room With Burnt Orange Wooden Trims", "Spacious Living Room With Mustard wall With Framework"];
        const prilist = ["", "243,965", "86,039", "154,371", "132,935", "114,997", "129,919", "101,274", "141,298", "148,505", "56,137"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/living${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`; 
        }
    }
    else if (topic == 'kitchen'){
        document.getElementById('head-title').textContent = "KITCHEN INTERIOR";
        document.getElementById('title').textContent = "The most frequented area of your home, the kitchen, should be functional, convenient and easy to use. Our modular kitchen solutions can be customised based on layouts, colours, finishes, accessories and more. Get inspired by our stunning kitchen designs (some with price included).";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-kitchen.jpg')";
        const namelist = ["", "Modern-style Budget L-shaped Modular Kitchen", "L-Shaped Modular Kitchen", "U-Shaped Modular Kitchen", "Multi-Functional Kitchen", "Modern Parallel Kitchen", "Monochromatic Modern Kitchen", "Red U-Shaped Kitchen", "Navy Blue Modular Kitchen", "Luxury Peninsula Kitchen", "Powder Blue Modern Kitchen"];
        const prilist = ["", "395,792", "393,808", "548,543", "418,989", "746,529", "877,211", "747,727", "687,048", "634,685", "902,661"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/kitchen${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
    else if (topic == 'master-bedroom'){
        document.getElementById('head-title').textContent = "BEDROOM INTERIOR";
        document.getElementById('title').textContent = "Looking for design ideas for your bedroom? You've come to the right place! Our bedroom designs are a cut above the rest as we ensure the perfect combination of beauty and functionality. Check out these inspiring design ideas.";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-master-bedroom.jpg')";
        const namelist = ["", "Small Master Bedroom With Drop Lights And Patterned Wallpaper", "Luxury Master Bedroom With Metallic Jali", "Modern Master Bedroom With Grey Colour Theme And Large Windows", "Luxury Master Bedroom With Metallic Piece On Wall", "Modern Master Bedroom With Large French Windows", "Modern Master Bedroom With Zigzag Patterned Wallpaper", "Small Master Bedroom With Soft Hues And Modern Furniture", "Modern Master Bedroom With Wooden Ceiling And Wooden Flooring", "Master Bedroom With Brown And Blue Colour Schemes", "Luxury Master Bedroom With Chandelier And Wooden Flooring"];
        const prilist = ["", "182,189", "181,765", "172,966", "199,241", "162,732", "258,580", "92,002", "241,856", "142,087", "198,819"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/master-bedroom${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
    else if (topic == 'dining-room'){
        document.getElementById('head-title').textContent = "DINING ROOM INTERIOR";
        document.getElementById('title').textContent = "Your dining room deserves some TLC! Whether you want to keep it simple or glam it up, we can give you the look that you desire. Here's some design inspiration for your dining space.";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-dining-room.jpg')";
        const namelist = ["", "Best 6-Seater Dining Room With Open Dining Area", "Small Dining Room With White And Marble Table Top", "4-Seater Dining Room With Unique Colour Palette", "Modern 4-Seater Dining Room", "Modern 8-Seater Dining Room", "Modern Dining Room With 4-seater Table", "6-Seater Dining Room With Mirror Wall Panel", "Modern Dining Room With 6 Seater Dining Table", "Small Dining Room With Yellow Chairs", "Royal Regale Dining Room"];
        const prilist = ["", "102,957", "221,426", "149,308", "170,556", "418,052", "122,025", "166,931", "183,741", "223,333", "574,642"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/dining-room${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
    else if (topic == 'kids-bedroom'){
        document.getElementById('head-title').textContent = "KID'S BEDROOM INTERIOR";
        document.getElementById('title').textContent = "Fun, cute, quirky—your little one's room should be all this, without compromising on safety, space and storage. Get inspired by our kid's bedroom designs.";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-kids-bedroom.jpg')";
        const namelist = ["", "Kid's Room For Teenage Girl", "Simple Kid's Room With Accent Wall With Sea And CoralSshades", "Small Kid's Room With Huge Storage For Stationary And Toys", "Spacious Kid's Room With Yellow Colour Tones", "Canary Kids Bedroom Interior Design", "Kid's Room With Blue And Yellow Hues", "Navy Kids Bedroom Interior Design", "Artistic Kids Bedroom Interior Design", "Dignified Kids Bedroom Interior Design", "Atmospheric Kids Bedroom Interior Design"];
        const prilist = ["", "335,893", "424,124", "222,884", "298,468", "136,845", "86,771", "56,843", "49,652", "59,648", "75,462"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/kids-bedroom${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
    else if (topic == 'bathroom'){
        document.getElementById('head-title').textContent = "BATHROOM INTERIOR";
        document.getElementById('title').textContent = "Dreaming of those spa-like bathrooms in hotels? We can give you the look you want! Browse through our stunning bathroom designs for some inspiration.";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-bathroom.jpg')";
        const namelist = ["", "Spacious Bathroom With Black Flooring And Brown Wall Tiles", "Contemporary Convenience Max Bathroom", "Contemporary Spacious Bathroom", "Modern Spacious Bathroom With Vanity", "Spacious Bathroom With Maximum Storage", "Contemporary Bathroom With Contrasting Palette", "Modern Spacious Bathroom", "Compact, Modern Bathroom", "Contemporary Spacious Bathroom", "Modern Spacious Bathroom With Vanity"];
        const prilist = ["", "69,652", "78,553", "74,525", "46,724", "58,642", "64,298", "245,682", "75,688", "95,426", "86,462"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/bathroom${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
    else if (topic == 'wardrobe'){
        document.getElementById('head-title').textContent = "WARDROBE INTERIOR";
        document.getElementById('title').textContent = "No matter how big or small your home is, you can never have enough of wardrobes and storage. Our modular wardrobes are available in a variety of sizes, materials and finishes—to suit your tastes and budget. Browse through our storage solutions.";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-wardrobe.jpg')";
        const namelist = ["", "Mirrored Wardrobe With Storage Lofts", "Large Wooden Wardrobe With Glossy Finish", "Sliding Wardrobe With Small Seating Pocket", "Modern Sleek Wardrobe For A Compact Layout", "Swing And Sliding Wardrobe With Monochromatic Palette", "Fully Loaded Wardrobe With Dresser And Loft", "Full Height Wardrobe With Seemless Shutters", "Classic Style Wardrobe With White Tones", "Sleek Wardrobe With Long Handles", "Functional Wardrobe With Glossy Touch and Base Storage"];
        const prilist = ["", "228,866", "254,723", "347,399", "194,164", "300,397", "311,533", "81,221", "121,244", "227,555", "181,631"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/wardrobe${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
    else if (topic == 'pooja-room'){
        document.getElementById('head-title').textContent = "POOJA ROOM INTERIOR";
        document.getElementById('title').textContent = "Your pooja room is the place that fills your home with spirituality and purity. Whether you want to design it traditionally as per vastu or give it a modern touch, we're here to help you. Here are a few pooja room designs to inspire you.";
        document.getElementById('bnr').style['background-image'] = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('source/show-background-pooja-room.jpg')";
        const namelist = ["", "Contemporary, Multi-Functional Pooja Space", "Unique Contemporary Pooja Room", "Premium Pooja Room with Natural Lighting", "Classic Open Pooja Area", "Contemporary Pooja Room", "Classic Golden Pooja Room", "Traditional Pooja Room", "Pooja Room With Gold Leaf Walls", "Pooja Room With Blue Wall", "Unique Wooden Pooja Room"];
        const prilist = ["", "228,866", "254,723", "347,399", "194,164", "300,397", "311,533", "81,221", "121,244", "227,555", "181,631"];
        for (let i = 1; i < 11; i++) {
            document.getElementById(`ima${i}`).src = `source/pooja-room${i}.jpg`;
            document.getElementById(`hed${i}`).textContent = `${namelist[i]}`; 
            document.getElementById(`pri${i}`).textContent = `₹${prilist[i]}`;
        }
    }
})