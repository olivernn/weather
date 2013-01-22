class ObservationsController < ApplicationController
  respond_to :json

  def index
    expires_in 1.day, public: true
    respond_with @observations = Observation.on_date(date).select("location_id, date, temperature")
  end

  private

  def date
    Date.parse(params[:date])
  end
end
