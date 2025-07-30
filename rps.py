import tkinter as tk
from random import randint
import os
print(os.getcwd())

class game:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("rock-paper-scissor")
        self.root.geometry("800x900")
        self.root.configure(bg= "#FFCDEB")
        
        self.root.grid_rowconfigure(0, weight=1)
        self.root.grid_columnconfigure(0, weight=1)

        image_path = os.path.dirname(os.path.abspath(__file__))

        self.rock = tk.PhotoImage(file=os.path.join(image_path, "rock.png")).subsample(4, 4)
        self.paper = tk.PhotoImage(file=os.path.join(image_path, "paper.png")).subsample(4, 4)
        self.scissor = tk.PhotoImage(file=os.path.join(image_path, "scissor.png")).subsample(4, 4)

        self.u = 0
        self.c = 0

        # Result label
        self.r = tk.Label(self.root, text="", font=("arial", 26), fg="#e94560", bg="#FFCDEB")
        self.r.grid(row=1, column=0, pady=10)

        # Choices display frame
        self.choice_frame = tk.Frame(self.root, bg="#16213e", padx=30, pady=20)
        self.choice_frame.grid(row=2, column=0)

        self.user = tk.Label(self.choice_frame, text="YOU", font=("arial", 16), fg="white", bg="#16213e")
        self.user.grid(row=0, column=0, padx=40)

        self.comp = tk.Label(self.choice_frame, text="COMPUTER", font=("arial", 16), fg="white", bg="#16213e")
        self.comp.grid(row=0, column=1, padx=40)

        self.uchoice = tk.Label(self.choice_frame, bg="#16213e")
        self.uchoice.grid(row=1, column=0, padx=40)

        self.cchoice = tk.Label(self.choice_frame, bg="#16213e")
        self.cchoice.grid(row=1, column=1, padx=40)

        # Button frame for RPS
        self.button_frame = tk.Frame(self.root, bg="#FFCDEB", pady=20)
        self.button_frame.grid(row=3, column=0)

        self.rockb = tk.Button(self.button_frame, image=self.rock, bg="#D6D6D6", bd=2, command=lambda: self.play(1))
        self.rockb.grid(row=0, column=0, padx=30)

        self.paperb = tk.Button(self.button_frame, image=self.paper, bg="#FFF5D2", bd=2, command=lambda: self.play(2))
        self.paperb.grid(row=0, column=1, padx=30)

        self.scissorsb = tk.Button(self.button_frame, image=self.scissor, bg="#E5D4F8", bd=2, command=lambda: self.play(3))
        self.scissorsb.grid(row=0, column=2, padx=30)

        # Restart button
        self.restartb = tk.Button(self.root, text="Play Again!", font=("arial", 14), bg="#D8B4F8", fg="white", command=self.restart)
        self.restartb.grid(row=4, column=0, pady=20)

        self.root.mainloop()

    def play(self, user_choice):
        self.r.config(text=" ")
        self.root.after(300, lambda: self.evaluate(user_choice))

    def evaluate(self, uc):
        cc = randint(1, 3)

        if cc == 1:
            self.cchoice.config(image=self.rock)
        elif cc == 2:
            self.cchoice.config(image=self.paper)
        elif cc == 3:
            self.cchoice.config(image=self.scissor)

        if uc == 1:
            self.uchoice.config(image=self.rock)
        elif uc == 2:
            self.uchoice.config(image=self.paper)
        elif uc == 3:
            self.uchoice.config(image=self.scissor)

        if cc == uc:
            self.r.config(text="TIE! TRY AGAIN!")
        elif (cc == 1 and uc == 3) or (cc == 2 and uc == 1) or (cc == 3 and uc == 2):
            self.c += 1
            self.r.config(text="COMPUTER WINS!")
            self.comp.config(text=f"COMPUTER: {self.c}")
        else:
            self.u += 1
            self.r.config(text="YOU WIN!")
            self.user.config(text=f"YOU: {self.u}")

    def restart(self):
        self.r.config(text="")
        self.uchoice.config(image="")
        self.cchoice.config(image="")
        self.uchoice.image = None
        self.cchoice.image = None
        self.u = 0
        self.c = 0
        self.comp.config(text="COMPUTER")
        self.user.config(text="YOU")

game()
