class Observation < ActiveRecord::Base
  attr_accessible :date, :wind_gust, :temperature, :visibility,
   :wind_direction, :wind_speed, :weather_type, :pressure

  belongs_to :location
end
