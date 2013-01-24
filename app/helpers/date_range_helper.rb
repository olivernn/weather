module DateRangeHelper
  def start_day(date_time_range)
    date_time_range.start.day
  end

  def start_month(date_time_range)
    date_time_range.start.strftime('%b')
  end

  def start_year(date_time_range)
    date_time_range.start.year
  end

  def start_hour(date_time_range)
    sprintf '%02d', date_time_range.start.hour
  end
end
