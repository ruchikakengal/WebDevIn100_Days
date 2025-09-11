    document.addEventListener('DOMContentLoaded', function() {
            const diceElement = document.getElementById('dice');
            const rollButton = document.getElementById('roll-button');
            const clearButton = document.getElementById('clear-button');
            const rollHistory = document.getElementById('roll-history');
            const totalRollsElement = document.getElementById('total-rolls');
            const currentRollElement = document.getElementById('current-roll');
            const averageRollElement = document.getElementById('average-roll');
            const historyCountElement = document.getElementById('history-count');
            
            let rollHistoryData = [];
            let totalRolls = 0;
            let sumOfRolls = 0;
            
            // Dice faces (Unicode characters)
            const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            
            // Function to roll the dice
            function rollDice() {
                // Add rolling animation
                diceElement.classList.add('rolling');
                
                // Generate random number after a short delay (to allow animation to play)
                setTimeout(() => {
                    const rollResult = Math.floor(Math.random() * 6) + 1;
                    
                    // Update dice face
                    diceElement.textContent = diceFaces[rollResult - 1];
                    
                    // Remove rolling animation
                    diceElement.classList.remove('rolling');
                    
                    // Update stats and history
                    updateStats(rollResult);
                    addToHistory(rollResult);
                }, 800);
            }
            
            // Function to update statistics
            function updateStats(rollResult) {
                totalRolls++;
                sumOfRolls += rollResult;
                const average = (sumOfRolls / totalRolls).toFixed(1);
                
                totalRollsElement.textContent = totalRolls;
                currentRollElement.textContent = rollResult;
                averageRollElement.textContent = average;
            }
            
            // Function to add roll to history
            function addToHistory(rollResult) {
                // Remove empty message if it exists
                const emptyMessage = rollHistory.querySelector('.empty-history');
                if (emptyMessage) {
                    rollHistory.removeChild(emptyMessage);
                }
                
                // Add to history data
                rollHistoryData.unshift({
                    id: totalRolls,
                    value: rollResult,
                    face: diceFaces[rollResult - 1]
                });
                
                // Keep only last 20 rolls
                if (rollHistoryData.length > 20) {
                    rollHistoryData.pop();
                }
                
                // Update history display
                updateHistoryDisplay();
            }
            
            // Function to update history display
            function updateHistoryDisplay() {
                // Clear current history display
                rollHistory.innerHTML = '';
                
                // Add each history item
                rollHistoryData.forEach(roll => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="roll-number">Roll ${roll.id}</span>
                        <span class="roll-value">${roll.face} (${roll.value})</span>
                    `;
                    rollHistory.appendChild(listItem);
                });
                
                // Update history count
                historyCountElement.textContent = `${rollHistoryData.length} rolls`;
            }
            
            // Function to clear history
            function clearHistory() {
                rollHistoryData = [];
                totalRolls = 0;
                sumOfRolls = 0;
                
                totalRollsElement.textContent = '0';
                currentRollElement.textContent = '-';
                averageRollElement.textContent = '0.0';
                
                rollHistory.innerHTML = '<li class="empty-history">No rolls yet. Start rolling!</li>';
                historyCountElement.textContent = '0 rolls';
            }
            
            // Event listeners
            rollButton.addEventListener('click', rollDice);
            diceElement.addEventListener('click', rollDice);
            clearButton.addEventListener('click', clearHistory);
            
            // Initialize with one roll
            setTimeout(rollDice, 500);
        });