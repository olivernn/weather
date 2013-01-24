class DateTimeRange

  attr_reader :start

  def self.ending_now
    start = 14.days.ago.at_beginning_of_day
    self.new(start.year, start.month, start.day, start.hour)
  end

  def initialize(year, month, date, hour)
    @start = DateTime.new(year.to_i, month.to_i, date.to_i, hour.to_i)
  end

  def end
    if start_within_last_fortnight?
      DateTime.now.at_beginning_of_day
    else
      start + 14.days
    end
  end

  def duration
    (send(:end) - start).to_i
  end

  private

  def start_within_last_fortnight?
    DateTime.now.at_beginning_of_day - start <= 14.days
  end
end
