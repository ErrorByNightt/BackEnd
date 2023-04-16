import hangman from '../routes/Hangman.route.js';

export async function getAll  (req, res) {
  hangman.find()
  .then(response =>{
      res.json({
          response
      })
  })
  .catch(error => {
      res.json ({
          message: 'An error occured. '
      }) 
  })
}
  
export async function AddWords(req, res) {
  const { word } = req.body
  const newWord = new hangman()

  newWord.word = word

  newWord.save()
  res.status(200).send({ message: "Success", game: newWord })

}



  