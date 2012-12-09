class Location < ActiveRecord::Base
  attr_accessible :ref, :lat, :lng, :name, :country, :continent

  has_many :observations
end
