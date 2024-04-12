

export default function(app) {

   
    app.get('/',  function(req, res) {
   
        
        res.sendFile('dist/index.html', {root: __dirname })
    });

      
}