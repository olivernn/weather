class LocationsController < ApplicationController
  respond_to :json

  def index
    respond_with Location.all
  end
end
