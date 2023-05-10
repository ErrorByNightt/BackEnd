import Comment from '../models/Comment.js';


export async function ADDComment(req, res) {
 

  const { text } = req.body
  const comment = new Comment()

  comment.text = text

  res.status(200).send({ message: "Success", comment: comment })

  }
