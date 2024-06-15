class CRUD {
    index(req, res) {
      try {
        this.find({})
          .then((result) => {
            res.json({ msg: "Data Retrieve Success", data: result });
          })
          .catch((err) => {
            res.json({ msg: "Data Retrieve failed", err: err });
          });
      } catch (error) {
        console.log("error", error);
      }
    }
  
    findid(req, res) {
      this.findOne({ _id: req.params.id })
        .then((result) => {
          res.json({ msg: "Data Retrieve Success", data: result });
        })
        .catch((err) => {
          res.json({ msg: "Data Retrieve failed", err: err });
        });
    }
  
    find(req, res) {
      this.find(req.body, (err, result) => {
        if (!err) res.json({ msg: "Data Retrieve Success", data: result });
        else res.json({ msg: "Data Retrieve failed", err: err });
      });
    }
  
    add(req, res) {
      let doc = new this(req.body);
      doc
        .save()
        .then((result) => {
          res.json({ msg: "Insert Success...", data: result });
        })
        .catch((err) => {
          res.json({ msg: "Insert failed", err: err });
        });
    }
  
    update(req, res) {
      this.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
        .then((result) => {
          res.json({ msg: "Update Success", data: result });
        })
        .catch((err) => {
          res.json({ msg: "Update failed", err: err });
        });
    }
  
    delete(req, res) {
      console.log(req.body);
      this.deleteOne({ _id: req.body._id })
        .then((result) => {
          res.json({ msg: "Data Delete Success", data: result });
        })
        .catch((err) => {
          res.json({ msg: "Data Delete failed", err: err });
        });
    }
  }
  
  module.exports = CRUD;
  