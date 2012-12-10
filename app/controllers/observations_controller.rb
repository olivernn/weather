class ObservationsController < ApplicationController
  respond_to :json

  def index
    respond_with Observation.where(date: DateTime.new(2012, 12, 8, 12))
  end
end
