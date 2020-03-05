from backend import *
from flask import Flask, request, jsonify, render_template, url_for

app = Flask(__name__)

@app.route('/')
def home():
   # os.system('''cmd /c "start /min cmd.exe /c backend.exe "''')
    return render_template('home.html')

@app.errorhandler(404)
def error(error):
    return "404--Not Found"

@app.route('/api')
def api():
    word = request.args.get('word')
    data = autoComplete(list(word.split(" "))[-1])
    d = dict()
    for i in range(0,len(data)):
        d[i] = data[i]
    return(jsonify(d))


if __name__=="__main__":
    app.run(debug=True)
