from backend import *
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def home():
    os.system('''cmd /c "start /min cmd.exe /c backend.exe "''')
    return render_template('home.html')

@app.route('/api')
def api():
    word = request.args.get('word')
    if word!='':
        data = autoComplete(list(word.split(" "))[-1])
        d = dict()
        for i in range(0,len(data)):
            d[i] = data[i]
        return(jsonify(d))
    return ""

if __name__=="__main__":
    app.run(debug=True)
