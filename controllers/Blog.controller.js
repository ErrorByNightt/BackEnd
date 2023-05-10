import BlogPost from '../models/BlogPost.js';
import Comment from '../models/Comment.js';


export async function ADDBlog(req, res) {
    
  /*  const blogpost = BlogPost({
        username: req.username,
        title: req.body.title,
        body: req.body.body,
      });
      blogpost
        .save()
        .then((result) => {
          res.json({ data: result["_id"] });
        })
        .catch((err) => {
          console.log(err), res.json({ err: err });
        });
*/

  const { title,body,username } = req.body
  const blogpost = new BlogPost()

  blogpost.title = title
  blogpost.body = body
  blogpost.username = username
  blogpost.coverImage =`${req.protocol}://${req.get('host')}/img/${req.body.coverImage}`


  res.status(200).send({ message: "Success", blog: blogpost })

  }

  
export async function getAll (req,res) {

  res.send({ blog: await BlogPost.find() })
}

  export async function getById(req, res) {

    res.send({ blog: await BlogPost.findById(req.body._id) })
  }

export async function findOneAndUpdateImage(req, res) {
  BlogPost.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        coverImage:req.file.path,
      },
    },
    { new: true },
    (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
 }); }




export async function GetOwnBlog(req, res) {

 BlogPost.find({username:req.username},(err,result)=>{
  if (err) return res.json(err);
  return res.json({ data : result });
 });
  };


  export async function deleteBlog(req, res) {

    BlogPost.findByIdAndRemove({
      _id:req.params.id},(err,result)=>{
        if (err) return res.json(err);
       else  if(result){
          console.log(result);
          return res.json("Blog deleted")
        }
return res.json("blog not deleted");
      });
     };
   
   
   
  
//update image
export async function updateImage(req, res) {
  try {
    const user = await BlogPost.findOneAndUpdate(
      { _id: req.params.id },
      { 
        coverImage: `http://localhost:9095/uploads/${req.file.coverImage}`
      },
      { new: true } // return the updated user object
    );

    // save the updated user object
    await user.save();

    res.json({ message: "Image uploaded successfully", imageUrl: `http://localhost:9095/uploads/${req.file.coverImage}`
   });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}



// Add a new comment to a blog post
async function addCommentToBlogPost(blogPostId, commentText) {
  const comment = new Comment({ text: commentText });
  await comment.save();

  const blogPost = await BlogPost.findById(blogPostId);
  blogPost.comments.push(comment._id);
  blogPost.commentCount = blogPost.comments.length;
  await blogPost.save();
}