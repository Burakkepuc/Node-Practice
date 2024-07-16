class Response {
  constructor(data = null, message = null, status) {
    this.data = data;
    this.message = message;
    this.status = status;
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ?? "Process is successed"
    })
  }

  created(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ?? "Create process is done"
    })
  }

  errror500(res) {
    return res.status(500).json({
      success: false,
      data: this.data,
      message: this.message ?? "Server error"
    })
  }

  errror400(res) {
    return res.status(400).json({
      success: false,
      data: this.data,
      message: this.message ?? "Process is not done"
    })
  }

  errror401(res) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message ?? "Please sign-in"
    })
  }

  errror404(res) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message ?? "Process is not done"
    })
  }

  errror404(res) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message ?? "Lots of request received! "
    })
  }
}

module.exports = Response;