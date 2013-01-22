class LocationsController < ApplicationController
  respond_to :json

  def index
    expires_in 1.day, public: true
    respond_with @locations = Location.select('id, name, lat, lng')
  end
end
