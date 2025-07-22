// TypeRush - Typing Speed Test Application
class TypeRush {
    constructor() {
        // Test content organized by difficulty and type
        this.testContent = {
            words: {
                easy: [
                    "cat dog run fun sun hat bat car top box",
                    "red blue big small hot cold day night up down",
                    "yes no go stop fast slow good bad new old",
                    "home work play rest eat drink walk talk see hear",
                    "book pen cup tea bed chair table door window wall",
                    "love hope peace smile happy joy kind nice warm sweet",
                    "run walk jump play sing dance laugh cry help hug",
                    "tree flower grass bird fish water sky moon star light",
                    "food apple bread milk cake pizza ice cream candy fruit",
                    "school teacher student learn read write count draw paint music",
                    "family mom dad brother sister baby child friend neighbor pet",
                    "house room kitchen garden park store shop street city town",
                    "phone computer game toy ball bike bus train plane boat",
                    "morning afternoon evening night today tomorrow yesterday week month year",
                    "spring summer autumn winter rain snow wind cloud rainbow sunshine"
                ],
                medium: [
                    "quick brown fox jumps over lazy dog near river",
                    "beautiful flowers bloom during spring season every year always",
                    "programming requires practice patience dedication consistent effort daily improvement",
                    "technology advances rapidly changing modern world significantly today",
                    "students study various subjects mathematics science history literature art",
                    "mountain climbing adventure requires proper equipment safety training experience",
                    "ocean waves crash against rocky cliffs creating spectacular natural display",
                    "library contains thousands books magazines journals research materials knowledge",
                    "restaurant serves delicious international cuisine prepared professional experienced chefs",
                    "museum exhibits ancient artifacts contemporary artworks historical cultural treasures",
                    "university campus provides excellent academic resources learning opportunities students",
                    "hospital emergency medical treatment healthcare professionals dedicated patient care",
                    "airport international flights departure arrival passengers luggage security procedures",
                    "shopping center retail stores fashion clothing electronics entertainment dining",
                    "conference business meeting presentation discussion collaboration teamwork networking"
                ],
                difficult: [
                    "extraordinarily sophisticated metamorphosis psychological phenomenon characteristics",
                    "unprecedented accomplishment revolutionary breakthrough magnificent extraordinary achievement",
                    "inconceivable incomprehensible unquestionably indispensable irreplaceable irreversible",
                    "simultaneously comprehensive understanding philosophical implications theoretical frameworks",
                    "authentication authorization implementation configuration optimization synchronization",
                    "pharmaceutical biotechnology nanotechnology telecommunications infrastructure development",
                    "neuropsychology epistemology phenomenology hermeneutics existentialism postmodernism",
                    "constitutional jurisprudence administrative bureaucracy governmental institutional",
                    "anthropological archaeological paleontological geological geographical astronomical",
                    "cardiovascular respiratory gastrointestinal neurological endocrinological dermatological",
                    "thermodynamics electromagnetism quantum mechanics relativistic cosmological",
                    "microeconomics macroeconomics econometrics financial investment securities",
                    "biochemistry molecular genetics cellular mitochondrial chromosomal",
                    "architectural engineering structural mechanical electrical aeronautical",
                    "psychological psychiatric therapeutic rehabilitative counseling intervention"
                ]
            },
            sentences: {
                easy: [
                    "The cat sits on the mat and sleeps all day long.",
                    "I like to eat ice cream on hot summer days.",
                    "The sun shines bright in the clear blue sky today.",
                    "My dog loves to play fetch in the green park.",
                    "We go to school every day to learn new things.",
                    "Birds fly high in the sky and sing beautiful songs.",
                    "Children laugh and play games in the playground.",
                    "The moon comes out at night when it gets dark.",
                    "Flowers grow in the garden and smell very nice.",
                    "Fish swim in the water and eat small plants.",
                    "Books help us learn about many different places.",
                    "Friends like to share toys and play together.",
                    "Rain falls from clouds and waters the plants.",
                    "Cars drive on roads to take people places.",
                    "Family dinners are fun times to talk and eat."
                ],
                medium: [
                    "The quick brown fox jumps over the lazy dog near the riverbank.",
                    "Programming is not about what you know; it's about what you can figure out.",
                    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                    "In the middle of difficulty lies opportunity, and we must seize it.",
                    "The only way to do great work is to love what you do every single day.",
                    "Education is the most powerful weapon which you can use to change the world.",
                    "Technology has become an integral part of our daily lives and communication.",
                    "Environmental conservation requires collective effort from individuals and governments worldwide.",
                    "Critical thinking skills are essential for solving complex problems in modern society.",
                    "Cultural diversity enriches our understanding of different perspectives and traditions.",
                    "Scientific research continues to unlock mysteries about our universe and existence.",
                    "Effective communication involves both listening carefully and expressing ideas clearly.",
                    "Financial literacy helps people make informed decisions about money and investments.",
                    "Creative expression through art, music, and literature enhances human experience.",
                    "Leadership requires balancing confidence with humility and vision with practical action."
                ],
                difficult: [
                    "Extraordinarily sophisticated technological implementations require comprehensive understanding of multifaceted algorithmic paradigms.",
                    "The metamorphosis of contemporary philosophical frameworks necessitates unprecedented intellectual sophistication and analytical prowess.",
                    "Incomprehensible psychological phenomena manifest through intricate neurological pathways and synaptic configurations.",
                    "Revolutionary breakthroughs in quantum computational methodologies demand extraordinary mathematical precision and theoretical comprehension.",
                    "Multidisciplinary approaches to solving complex sociological problems require unprecedented collaborative methodologies.",
                    "Epistemological investigations into the nature of consciousness challenge fundamental assumptions about reality and perception.",
                    "Neuroplasticity demonstrates the brain's remarkable capacity for reorganization throughout an individual's developmental trajectory.",
                    "Postmodern literary criticism deconstructs traditional narratives while simultaneously reconstructing alternative interpretive frameworks.",
                    "Biotechnological advances in genetic engineering raise profound ethical questions about human enhancement and modification.",
                    "Macroeconomic policy decisions have far-reaching implications for global financial stability and international relations.",
                    "Phenomenological analysis reveals the intricate relationship between subjective experience and objective reality.",
                    "Constitutional jurisprudence requires careful interpretation of legal precedents within evolving societal contexts.",
                    "Anthropological studies illuminate the complex interplay between cultural practices and environmental adaptations.",
                    "Psychotherapeutic interventions must address both symptomatic manifestations and underlying psychological dynamics.",
                    "Astrophysical observations continue to challenge our understanding of cosmic evolution and universal constants."
                ]
            },
            paragraphs: {
                easy: [
                    "The sun was shining bright in the clear blue sky. Birds were singing in the trees. Children were playing in the park. It was a perfect day for a picnic. Families spread their blankets on the green grass. Everyone was happy and smiling.",
                    "My cat likes to sleep all day. She finds the warmest spot in the house. Sometimes she sleeps on my bed. Other times she sleeps in the sun. When she wakes up, she stretches and yawns. Then she looks for food to eat.",
                    "I love reading books in my free time. My favorite place to read is by the window. The natural light is perfect for reading. I enjoy stories about adventure and mystery. Reading helps me learn new words. It also helps me relax after a busy day.",
                    "The school playground is full of fun activities. There are swings that go high in the air. The slide is tall and exciting to go down. Children run around playing tag and hide and seek. Teachers watch to make sure everyone is safe. Laughter fills the air during recess time.",
                    "Our family dog is very friendly and playful. He loves to fetch balls in the backyard. When visitors come to our house, he wags his tail happily. At night, he sleeps by my bed and keeps me company. In the morning, he wakes me up by licking my face.",
                    "The kitchen smells wonderful when mom is cooking dinner. She uses fresh vegetables from our garden. The sound of sizzling food makes everyone hungry. We help by setting the table with plates and cups. When dinner is ready, we all sit together and enjoy the meal.",
                    "Winter brings cold weather and beautiful snow. Children build snowmen in their yards. They also make snow angels by lying in the snow. Hot chocolate tastes especially good on cold days. Families gather around warm fires and tell stories together.",
                    "The library is a quiet place full of amazing books. People come here to read and study. Librarians help visitors find the books they need. Children attend story time to hear exciting tales. The library also has computers and games for everyone to use.",
                    "Going to the beach is always an adventure. The waves crash onto the sandy shore. Seagulls fly overhead looking for food. Children build sandcastles with buckets and shovels. Families swim in the cool ocean water and collect pretty shells.",
                    "The farmer works hard in his fields every day. He plants seeds in the spring and watches them grow. Rain and sunshine help the crops become strong. In the fall, he harvests vegetables and fruits. The fresh food goes to markets where people can buy it.",
                    "My grandmother tells the best bedtime stories. She sits in her comfortable rocking chair. Her voice is soft and gentle as she speaks. The stories are about brave heroes and magical places. I always fall asleep feeling happy and safe.",
                    "The zoo is home to many different animals. Elephants spray water with their long trunks. Monkeys swing from branch to branch playfully. Lions rest in the shade during the hot afternoon. Visitors walk around learning about animals from around the world.",
                    "Spring is my favorite season of the year. Flowers begin to bloom in bright colors. Trees grow new green leaves after winter. Birds return from their long trips south. The weather becomes warm and perfect for playing outside all day long.",
                    "The birthday party was full of excitement and joy. Colorful balloons decorated the room everywhere. A big chocolate cake sat on the table. Friends played games and sang happy songs. Everyone received small gifts to take home as memories.",
                    "Our neighborhood park has something for everyone. There are walking paths for morning exercise. A playground keeps children busy and active. Ducks swim in the small pond peacefully. Families have picnics under the big shade trees on sunny weekends."
                ],
                medium: [
                    "Technology has revolutionized the way we communicate and work in the modern world. Social media platforms connect people across continents instantly. Video conferencing allows teams to collaborate effectively from different locations. Mobile devices have become essential tools for both personal and professional use. However, this digital transformation also brings challenges such as privacy concerns and the need for digital literacy.",
                    "Environmental conservation is one of the most pressing issues of our time. Climate change affects weather patterns, wildlife habitats, and human communities worldwide. Renewable energy sources like solar and wind power offer sustainable alternatives to fossil fuels. Individuals can contribute by reducing waste, conserving water, and making environmentally conscious choices. Collective action and government policies are essential for creating meaningful environmental change.",
                    "The field of artificial intelligence continues to advance at an unprecedented pace. Machine learning algorithms can now process vast amounts of data and identify complex patterns. Natural language processing enables computers to understand and generate human-like text. While AI offers tremendous benefits in healthcare, education, and business, it also raises important questions about ethics, employment, and the future of human-machine interaction.",
                    "Modern education systems are adapting to meet the changing needs of students and society. Online learning platforms provide flexible access to educational resources and courses. Interactive technologies enhance classroom engagement and personalized learning experiences. Teachers are incorporating multimedia tools and collaborative projects to develop critical thinking skills. The goal is to prepare students for careers that may not even exist today.",
                    "Global trade and economic interconnectedness have created both opportunities and challenges for nations worldwide. International markets allow countries to specialize in their competitive advantages while accessing diverse products and services. However, economic volatility in one region can quickly spread to other parts of the world. Governments must balance free trade benefits with protecting domestic industries and workers from unfair competition.",
                    "Healthcare advancements have dramatically improved quality of life and life expectancy in many parts of the world. Medical research continues to develop new treatments for previously incurable diseases. Preventive medicine emphasizes the importance of healthy lifestyle choices and regular screenings. Telemedicine is expanding access to healthcare services in remote and underserved communities. Despite progress, healthcare accessibility and affordability remain significant global challenges.",
                    "Urban planning and development require careful consideration of multiple factors including population growth, infrastructure needs, and environmental impact. Smart city initiatives use technology to improve traffic flow, energy efficiency, and public services. Green building practices promote sustainable construction and reduce carbon footprints. Public transportation systems help reduce traffic congestion and air pollution while providing affordable mobility options for residents.",
                    "Scientific research methodology has evolved to become more rigorous and collaborative across disciplines. Peer review processes ensure that published findings meet high standards of evidence and validity. International research partnerships enable scientists to tackle complex global challenges that require diverse expertise and resources. Open access publishing is making scientific knowledge more widely available to researchers and the general public worldwide.",
                    "Cultural preservation efforts are working to maintain traditional languages, customs, and artistic expressions in an increasingly globalized world. Digital archives are being created to document and share cultural heritage with future generations. Community-based initiatives engage local populations in preserving their unique traditions while adapting to modern circumstances. Museums and cultural centers play important roles in educating people about diverse cultural histories and contributions.",
                    "Financial markets have become increasingly complex and interconnected through technological innovation and globalization. Electronic trading systems execute millions of transactions per second across multiple time zones and currencies. Investment strategies now incorporate sophisticated algorithms and artificial intelligence to analyze market trends and make decisions. Regulatory frameworks are constantly evolving to address new financial instruments and protect investors from systemic risks.",
                    "Space exploration continues to push the boundaries of human knowledge and technological capabilities. International space agencies collaborate on ambitious projects including Mars missions and deep space telescopes. Commercial space companies are reducing launch costs and developing new technologies for satellite deployment and space tourism. These advances have practical applications including improved weather forecasting, GPS navigation, and global communications systems.",
                    "Renewable energy technology is rapidly advancing and becoming more cost-effective compared to traditional fossil fuel sources. Solar panel efficiency has improved dramatically while manufacturing costs continue to decrease. Wind turbine designs are becoming larger and more efficient at capturing energy from wind currents. Energy storage solutions are solving the intermittency challenges associated with renewable sources and enabling greater grid stability.",
                    "Social media has fundamentally changed how people communicate, share information, and form communities around shared interests. These platforms enable rapid dissemination of news and ideas but also create challenges related to misinformation and echo chambers. Digital literacy education is becoming essential for helping people critically evaluate online content and understand privacy implications. Governments and platforms are working to balance free expression with content moderation responsibilities.",
                    "Precision agriculture uses technology to optimize farming practices and increase crop yields while minimizing environmental impact. GPS-guided equipment ensures accurate planting, fertilizing, and harvesting operations. Drone surveillance and satellite imagery help farmers monitor crop health and identify problems early. Data analytics enables farmers to make informed decisions about irrigation, pest control, and resource allocation based on real-time field conditions.",
                    "Mental health awareness has increased significantly as society recognizes the importance of psychological well-being alongside physical health. Workplace wellness programs are incorporating stress management and mental health support services. Teletherapy options are expanding access to mental health professionals, particularly in areas with limited resources. Public education campaigns are working to reduce stigma and encourage people to seek help when needed."
                ],
                difficult: [
                    "The paradigmatic shift in contemporary epistemological frameworks necessitates a comprehensive reevaluation of traditional methodological approaches to knowledge acquisition and dissemination. Postmodern philosophical discourse challenges the foundational assumptions of empirical positivism, introducing hermeneutical perspectives that emphasize the interpretive nature of human understanding. This metamorphosis in intellectual discourse has profound implications for academic disciplines ranging from anthropology to quantum physics, requiring scholars to navigate increasingly complex theoretical landscapes while maintaining rigorous analytical standards.",
                    "Neuroplasticity represents one of the most extraordinary discoveries in contemporary neuroscience, fundamentally altering our understanding of brain functionality and adaptability. The brain's capacity for structural and functional reorganization throughout an individual's lifespan challenges previously held beliefs about neural development and cognitive potential. This remarkable phenomenon underlies therapeutic interventions for neurological disorders, learning disabilities, and psychological trauma, offering unprecedented opportunities for rehabilitation and cognitive enhancement through targeted interventions and environmental modifications.",
                    "Quantum computational paradigms represent a revolutionary departure from classical information processing methodologies, leveraging the extraordinary properties of quantum mechanical systems to perform calculations that are intractable for conventional computers. The phenomenon of quantum superposition allows quantum bits to exist in multiple states simultaneously, while quantum entanglement creates instantaneous correlations between particles regardless of spatial separation. These counterintuitive properties enable quantum algorithms to solve specific problems exponentially faster than their classical counterparts, with profound implications for cryptography, optimization, and scientific simulation.",
                    "Biotechnological advances in genetic engineering and synthetic biology are revolutionizing medical treatment, agricultural production, and environmental remediation while simultaneously raising unprecedented ethical and regulatory challenges. CRISPR-Cas9 gene editing technology enables precise modifications to DNA sequences, offering potential cures for hereditary diseases and enhanced crop characteristics. However, the possibility of unintended consequences and the democratization of genetic modification tools necessitate careful consideration of safety protocols, international governance frameworks, and equitable access to these transformative technologies.",
                    "Macroeconomic policy formulation in the contemporary global financial system requires sophisticated understanding of complex interdependencies between monetary policy, fiscal policy, and international trade relationships. Central bank decisions regarding interest rates and quantitative easing programs have far-reaching implications for employment, inflation, exchange rates, and capital flows across national borders. The challenge of balancing domestic economic objectives with international competitiveness and financial stability requires nuanced analysis of multiple economic indicators and potential policy spillover effects.",
                    "Anthropological investigations into cultural adaptation and evolution reveal the intricate relationships between environmental pressures, technological innovations, and social organizational structures throughout human history. Archaeological evidence demonstrates how societies have developed diverse strategies for resource management, conflict resolution, and knowledge transmission across generations. Contemporary ethnographic studies continue to illuminate the remarkable diversity of human cultural expressions while identifying universal patterns in social behavior and cognitive development processes.",
                    "Phenomenological analysis of consciousness and subjective experience challenges reductionist approaches to understanding the mind-brain relationship and the nature of human awareness. The hard problem of consciousness involves explaining how and why physical processes in the brain give rise to subjective experiences and qualia that cannot be fully captured through objective scientific measurement. This philosophical inquiry has implications for artificial intelligence development, medical ethics regarding consciousness in vegetative states, and fundamental questions about the nature of reality and personal identity.",
                    "Constitutional jurisprudence requires careful interpretation of legal precedents within evolving social contexts while maintaining consistency with fundamental principles of justice and democratic governance. Supreme Court decisions establish binding precedents that shape constitutional interpretation for generations, yet must also respond to changing societal values and technological developments that the original framers could not have anticipated. The tension between originalist and living constitution approaches reflects deeper philosophical disagreements about the nature of law, interpretation, and democratic legitimacy.",
                    "Astrophysical observations and theoretical models continue to challenge our understanding of cosmic evolution, dark matter, dark energy, and the fundamental structure of spacetime itself. The discovery of gravitational waves has opened new avenues for studying extreme cosmic phenomena such as black hole mergers and neutron star collisions. These observations provide crucial tests of Einstein's general relativity theory while revealing the existence of previously unknown cosmic structures and processes that comprise the vast majority of the universe's mass and energy.",
                    "Psychotherapeutic interventions must integrate understanding of neurobiological processes, psychological development, social contexts, and cultural factors to effectively address complex mental health conditions. Evidence-based treatment approaches combine insights from cognitive-behavioral therapy, psychodynamic theory, humanistic psychology, and neuroscience research to develop personalized treatment plans. The therapeutic relationship itself becomes a crucial factor in treatment outcomes, requiring clinicians to balance professional boundaries with genuine empathy and cultural sensitivity.",
                    "Sustainable development strategies require comprehensive integration of environmental protection, economic growth, and social equity objectives across local, national, and global scales. The United Nations Sustainable Development Goals provide a framework for addressing interconnected challenges including poverty, climate change, biodiversity loss, and inequality. Implementation requires innovative financing mechanisms, technology transfer, capacity building, and international cooperation while respecting cultural diversity and national sovereignty in determining appropriate development pathways.",
                    "Artificial intelligence and machine learning algorithms are increasingly being deployed in critical decision-making processes including criminal justice, healthcare diagnosis, financial lending, and employment screening. The potential for algorithmic bias to perpetuate or amplify existing social inequalities has prompted calls for greater transparency, accountability, and fairness in automated decision systems. Developing ethical AI requires interdisciplinary collaboration between computer scientists, ethicists, social scientists, and domain experts to ensure that technological capabilities serve human welfare and democratic values.",
                    "Immunological research has revealed the extraordinary complexity of the human immune system's ability to distinguish between self and non-self while maintaining tolerance for beneficial microorganisms and preventing autoimmune reactions. The discovery of immune checkpoint proteins has revolutionized cancer treatment by enabling the development of immunotherapy approaches that harness the body's own immune system to fight malignant cells. Understanding immunological memory and adaptive immunity has also been crucial for vaccine development and transplant medicine.",
                    "Linguistic analysis reveals the deep connections between language structure, cognitive processes, and cultural worldviews while demonstrating both universal patterns and remarkable diversity in human communication systems. The study of endangered languages provides crucial insights into the full range of human linguistic capabilities and the cultural knowledge embedded in these communication systems. Digital humanities approaches are enabling large-scale analysis of linguistic change over time and the documentation of previously understudied languages and dialects.",
                    "Philosophical investigations into the nature of personal identity, consciousness, and moral responsibility have profound implications for practical ethics, legal systems, and medical decision-making. The question of what constitutes personal identity over time becomes particularly complex when considering cases of severe brain injury, dementia, or potential future technologies for consciousness transfer or enhancement. These inquiries challenge traditional assumptions about individual autonomy, moral culpability, and the foundations of human rights and dignity."
                ]
            }
        };
        
        this.currentTestType = 'words';
        this.currentDifficulty = 'medium';
        this.currentText = '';
        this.startTime = null;
        this.endTime = null;
        this.isTestActive = false;
        this.isTestCompleted = false;
        this.timer = null;
        this.timeElapsed = 0;
        
        // Statistics
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        this.incorrectCharacters = 0;
        this.currentCharIndex = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.loadNewText();
    }
    
    initializeElements() {
        this.sentenceElement = document.getElementById('sentence');
        this.userInputElement = document.getElementById('userInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.newSentenceBtn = document.getElementById('newSentenceBtn');
        this.resultsElement = document.getElementById('results');
        
        // Option buttons
        this.typeButtons = document.querySelectorAll('[data-type]');
        this.difficultyButtons = document.querySelectorAll('[data-difficulty]');
        
        // Stats elements
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.timeElement = document.getElementById('time');
        
        // Final results elements
        this.finalWpmElement = document.getElementById('finalWpm');
        this.finalAccuracyElement = document.getElementById('finalAccuracy');
        this.finalTimeElement = document.getElementById('finalTime');
        this.finalCharsElement = document.getElementById('finalChars');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.newSentenceBtn.addEventListener('click', () => this.loadNewText());
        this.userInputElement.addEventListener('input', (e) => this.handleInput(e));
        this.userInputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Option button events
        this.typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeTestType(e.target.dataset.type));
        });
        
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeDifficulty(e.target.dataset.difficulty));
        });
    }
    
    changeTestType(type) {
        if (this.isTestActive) return;
        
        this.currentTestType = type;
        this.updateActiveButton(this.typeButtons, type, 'data-type');
        this.loadNewText();
    }
    
    changeDifficulty(difficulty) {
        if (this.isTestActive) return;
        
        this.currentDifficulty = difficulty;
        this.updateActiveButton(this.difficultyButtons, difficulty, 'data-difficulty');
        this.loadNewText();
    }
    
    updateActiveButton(buttons, value, attribute) {
        buttons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[${attribute}="${value}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    loadNewText() {
        const textArray = this.testContent[this.currentTestType][this.currentDifficulty];
        const randomIndex = Math.floor(Math.random() * textArray.length);
        this.currentText = textArray[randomIndex];
        this.displayText();
        this.resetTest();
    }
    
    displayText() {
        this.sentenceElement.innerHTML = this.currentText
            .split('')
            .map((char, index) => {
                // Handle spaces properly
                const displayChar = char === ' ' ? '&nbsp;' : char;
                return `<span class="char" data-index="${index}">${displayChar}</span>`;
            })
            .join('');
    }
    
    startTest() {
        if (this.isTestActive) return;
        
        this.isTestActive = true;
        this.isTestCompleted = false;
        this.startTime = new Date().getTime();
        this.currentCharIndex = 0;
        this.correctCharacters = 0;
        this.incorrectCharacters = 0;
        this.timeElapsed = 0;
        
        // Enable input and focus
        this.userInputElement.disabled = false;
        this.userInputElement.focus();
        this.userInputElement.value = '';
        
        // Update UI
        this.startBtn.textContent = 'Testing...';
        this.startBtn.disabled = true;
        this.resultsElement.style.display = 'none';
        
        // Start timer
        this.startTimer();
        
        // Highlight first character
        this.highlightCurrentCharacter();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            if (this.isTestActive && !this.isTestCompleted) {
                this.timeElapsed++;
                this.timeElement.textContent = this.timeElapsed;
                this.updateLiveStats();
            }
        }, 1000);
    }
    
    handleInput(e) {
        if (!this.isTestActive || this.isTestCompleted) return;
        
        const inputValue = e.target.value;
        const currentChar = this.currentText[this.currentCharIndex];
        const typedChar = inputValue[inputValue.length - 1];
        
        // Handle character comparison
        if (inputValue.length > this.currentCharIndex) {
            this.processCharacter(typedChar, currentChar);
            this.currentCharIndex++;
            
            // Check if test is completed
            if (this.currentCharIndex >= this.currentText.length) {
                this.completeTest();
            } else {
                this.highlightCurrentCharacter();
            }
        }
        
        this.updateLiveStats();
    }
    
    handleKeyDown(e) {
        if (!this.isTestActive || this.isTestCompleted) return;
        
        // Handle backspace
        if (e.key === 'Backspace' && this.currentCharIndex > 0) {
            this.currentCharIndex = Math.max(0, this.userInputElement.value.length);
            this.highlightCurrentCharacter();
            this.updateCharacterDisplay();
        }
    }
    
    processCharacter(typedChar, expectedChar) {
        const charElement = document.querySelector(`[data-index="${this.currentCharIndex}"]`);
        
        if (typedChar === expectedChar) {
            this.correctCharacters++;
            charElement.classList.add('correct');
            charElement.classList.remove('incorrect');
        } else {
            this.incorrectCharacters++;
            charElement.classList.add('incorrect');
            charElement.classList.remove('correct');
        }
    }
    
    updateCharacterDisplay() {
        const inputValue = this.userInputElement.value;
        const charElements = document.querySelectorAll('.char');
        
        charElements.forEach((element, index) => {
            element.classList.remove('correct', 'incorrect', 'current');
            
            if (index < inputValue.length) {
                const typedChar = inputValue[index];
                const expectedChar = this.currentText[index];
                
                if (typedChar === expectedChar) {
                    element.classList.add('correct');
                } else {
                    element.classList.add('incorrect');
                }
            }
        });
    }
    
    highlightCurrentCharacter() {
        // Remove current highlighting
        document.querySelectorAll('.char').forEach(char => {
            char.classList.remove('current');
        });
        
        // Add current highlighting
        if (this.currentCharIndex < this.currentText.length) {
            const currentCharElement = document.querySelector(`[data-index="${this.currentCharIndex}"]`);
            if (currentCharElement) {
                currentCharElement.classList.add('current');
            }
        }
    }
    
    updateLiveStats() {
        if (this.timeElapsed === 0) return;
        
        // Calculate WPM (assuming 5 characters per word)
        const wordsTyped = this.correctCharacters / 5;
        const timeInMinutes = this.timeElapsed / 60;
        const wpm = Math.round(wordsTyped / timeInMinutes) || 0;
        
        // Calculate accuracy
        const totalTyped = this.correctCharacters + this.incorrectCharacters;
        const accuracy = totalTyped > 0 ? Math.round((this.correctCharacters / totalTyped) * 100) : 100;
        
        // Update display
        this.wpmElement.textContent = wpm;
        this.accuracyElement.textContent = accuracy;
    }
    
    completeTest() {
        this.isTestCompleted = true;
        this.isTestActive = false;
        this.endTime = new Date().getTime();
        
        // Stop timer
        clearInterval(this.timer);
        
        // Disable input
        this.userInputElement.disabled = true;
        
        // Calculate final statistics
        this.calculateFinalStats();
        
        // Show results
        this.showResults();
        
        // Reset button
        this.startBtn.textContent = 'Start Test';
        this.startBtn.disabled = false;
    }
    
    calculateFinalStats() {
        const totalTime = (this.endTime - this.startTime) / 1000; // in seconds
        const timeInMinutes = totalTime / 60;
        
        // Calculate WPM
        const wordsTyped = this.correctCharacters / 5;
        const wpm = Math.round(wordsTyped / timeInMinutes) || 0;
        
        // Calculate accuracy
        const totalTyped = this.correctCharacters + this.incorrectCharacters;
        const accuracy = totalTyped > 0 ? Math.round((this.correctCharacters / totalTyped) * 100) : 100;
        
        // Update final stats display
        this.finalWpmElement.textContent = wpm;
        this.finalAccuracyElement.textContent = accuracy + '%';
        this.finalTimeElement.textContent = Math.round(totalTime) + 's';
        this.finalCharsElement.textContent = totalTyped;
        
        // Update live stats one final time
        this.wpmElement.textContent = wpm;
        this.accuracyElement.textContent = accuracy;
        this.timeElement.textContent = Math.round(totalTime);
    }
    
    showResults() {
        this.resultsElement.style.display = 'block';
        this.resultsElement.classList.add('fade-in');
        
        // Scroll to results
        this.resultsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    resetTest() {
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Reset state
        this.isTestActive = false;
        this.isTestCompleted = false;
        this.startTime = null;
        this.endTime = null;
        this.timeElapsed = 0;
        this.currentCharIndex = 0;
        this.correctCharacters = 0;
        this.incorrectCharacters = 0;
        
        // Reset UI
        this.userInputElement.value = '';
        this.userInputElement.disabled = true;
        this.startBtn.textContent = 'Start Test';
        this.startBtn.disabled = false;
        this.resultsElement.style.display = 'none';
        
        // Reset stats display
        this.wpmElement.textContent = '0';
        this.accuracyElement.textContent = '100';
        this.timeElement.textContent = '0';
        
        // Reset text highlighting
        document.querySelectorAll('.char').forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        
        // Re-display text
        this.displayText();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypeRush();
});

// Add some utility functions for enhanced user experience
document.addEventListener('keydown', (e) => {
    // Allow starting test with Enter key when start button is focused
    if (e.key === 'Enter' && document.activeElement === document.getElementById('startBtn')) {
        document.getElementById('startBtn').click();
    }
    
    // Prevent accidental page reload during test
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        const typeRush = window.typeRush;
        if (typeRush && typeRush.isTestActive) {
            e.preventDefault();
            if (confirm('Are you sure you want to refresh? Your current test will be lost.')) {
                location.reload();
            }
        }
    }
});

// Prevent context menu during test to avoid disruption
document.addEventListener('contextmenu', (e) => {
    if (e.target.id === 'userInput') {
        e.preventDefault();
    }
});

// Add visual feedback for button interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});