class Heartbeat
  def initialize(app)
    @app = app
  end

  def call(env)
    if env['PATH_INFO'] == '/heartbeat'
      [
        200,
        {"Content-Type" => "text/plain"},
        ["OK"]
      ]
    else
      @app.call(env)
    end
  end
end
