class Observation < ActiveRecord::Base
  attr_accessible :date, :wind_gust, :temperature, :visibility,
   :wind_direction, :wind_speed, :weather_type, :pressure

  belongs_to :location

  scope :on_date, lambda { |date|
    where('date >= ? AND date < ?', date.beginning_of_day, date.end_of_day)
  }
end
