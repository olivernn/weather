class StartDateConstraint

  attr_reader :earliest_date

  def initialize(earliest_date)
    @earliest_date = earliest_date
  end

  def matches?(request)
    date = request_date(request.params)
    date.past? && earliest_date <= date
  rescue ArgumentError
    false
  end

  private

  def request_date(params)
    DateTime.new *[:year, :month, :day, :hour].map { |part| params[part].try(:to_i) }
  end
end
