        document.addEventListener('DOMContentLoaded', function() {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            const clicksElement = document.getElementById('clicks');
            const circlesElement = document.getElementById('numberOfCircles');
            const resetButton = document.getElementById('reset');
            const pauseButton = document.getElementById('pause');
            const addCirclesButton = document.getElementById('addCircles');
            const gravitySlider = document.getElementById('gravity');
            const airDragSlider = document.getElementById('airDrag');
            const elasticitySlider = document.getElementById('elasticity');
            const gravityValue = document.getElementById('gravityValue');
            const airDragValue = document.getElementById('airDragValue');
            const elasticityValue = document.getElementById('elasticityValue');
            const simSpeedElement = document.getElementById('simSpeed');

            // Set canvas size to match its container
            function resizeCanvas() {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }

            // Initial resize
            resizeCanvas();
            
            // Resize when window changes
            window.addEventListener('resize', resizeCanvas);

            // Physics parameters
            let gravity = parseFloat(gravitySlider.value);
            let airDrag = parseFloat(airDragSlider.value);
            let elasticity = parseFloat(elasticitySlider.value);
            let isPaused = false;
            let clickCount = 0;
            let circles = [];
            let frameCount = 0;
            let startTime = Date.now();
            let fps = 0;

            // Circle class
            class Circle {
                constructor(x, y, dx, dy, radius) {
                    this.x = x;
                    this.y = y;
                    this.dx = dx;
                    this.dy = dy;
                    this.radius = radius;
                    this.color = this.getRandomColor();
                    this.mass = radius * 0.1;
                }

                getRandomColor() {
                    const colors = [
                        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
                        '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
                        '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
                        '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
                    ];
                    return colors[Math.floor(Math.random() * colors.length)];
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                update() {
                    // Apply gravity
                    this.dy += gravity;
                    
                    // Apply air drag
                    this.dx *= (1 - airDrag);
                    this.dy *= (1 - airDrag);
                    
                    // Update position
                    this.x += this.dx;
                    this.y += this.dy;
                    
                    // Handle collisions with walls
                    if (this.x - this.radius < 0) {
                        this.x = this.radius;
                        this.dx = -this.dx * elasticity;
                    } else if (this.x + this.radius > canvas.width) {
                        this.x = canvas.width - this.radius;
                        this.dx = -this.dx * elasticity;
                    }
                    
                    if (this.y - this.radius < 0) {
                        this.y = this.radius;
                        this.dy = -this.dy * elasticity;
                    } else if (this.y + this.radius > canvas.height) {
                        this.y = canvas.height - this.radius;
                        this.dy = -this.dy * elasticity;
                        
                        // Add some friction when hitting the ground
                        this.dx *= 0.9;
                    }
                    
                    this.draw();
                }
            }

            // Create circles on click
            canvas.addEventListener('click', function(event) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                // Random velocity
                const dx = (Math.random() - 0.5) * 10;
                const dy = (Math.random() - 0.5) * 10;
                
                // Random radius
                const radius = Math.random() * 15 + 10;
                
                circles.push(new Circle(x, y, dx, dy, radius));
                clickCount++;
                clicksElement.textContent = clickCount;
                circlesElement.textContent = circles.length;
            });

            // Add multiple circles at once
            addCirclesButton.addEventListener('click', function() {
                for (let i = 0; i < 10; i++) {
                    const x = Math.random() * (canvas.width - 40) + 20;
                    const y = Math.random() * (canvas.height - 40) + 20;
                    const dx = (Math.random() - 0.5) * 10;
                    const dy = (Math.random() - 0.5) * 10;
                    const radius = Math.random() * 15 + 10;
                    
                    circles.push(new Circle(x, y, dx, dy, radius));
                }
                clickCount += 10;
                clicksElement.textContent = clickCount;
                circlesElement.textContent = circles.length;
            });

            // Reset simulation
            resetButton.addEventListener('click', function() {
                circles = [];
                clickCount = 0;
                clicksElement.textContent = clickCount;
                circlesElement.textContent = circles.length;
            });

            // Pause/resume simulation
            pauseButton.addEventListener('click', function() {
                isPaused = !isPaused;
                if (isPaused) {
                    pauseButton.innerHTML = '<i class="fas fa-play"></i> RESUME';
                } else {
                    pauseButton.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
                }
            });

            // Update slider values
            gravitySlider.addEventListener('input', function() {
                gravity = parseFloat(this.value);
                gravityValue.textContent = gravity.toFixed(3);
            });

            airDragSlider.addEventListener('input', function() {
                airDrag = parseFloat(this.value);
                airDragValue.textContent = airDrag.toFixed(5);
            });

            elasticitySlider.addEventListener('input', function() {
                elasticity = parseFloat(this.value);
                elasticityValue.textContent = elasticity.toFixed(2);
            });

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                
                // Calculate FPS
                frameCount++;
                const now = Date.now();
                const elapsed = now - startTime;
                
                if (elapsed >= 1000) {
                    fps = Math.round((frameCount * 1000) / elapsed);
                    simSpeedElement.textContent = `${fps} FPS`;
                    startTime = now;
                    frameCount = 0;
                }
                
                if (isPaused) return;
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw gradient background
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#1a2a6c');
                gradient.addColorStop(0.5, '#b21f1f');
                gradient.addColorStop(1, '#fdbb2d');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw grid
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1;
                
                // Vertical lines
                for (let x = 0; x < canvas.width; x += 20) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                
                // Horizontal lines
                for (let y = 0; y < canvas.height; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
                
                // Update and draw circles
                for (let i = 0; i < circles.length; i++) {
                    circles[i].update();
                }
                
                circlesElement.textContent = circles.length;
            }

            // Start animation
            animate();
        });