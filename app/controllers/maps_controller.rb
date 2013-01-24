class MapsController < ApplicationController
  def show
    @date_time_range = date_time_range
  end

  private

  def date_params_present?
    params.has_key?(:year) &&
    params.has_key?(:month) &&
    params.has_key?(:day) &&
    params.has_key?(:hour)
  end

  def date_time_range
    if date_params_present?
      DateTimeRange.new(params[:year], params[:month], params[:day], params[:hour])
    else
      DateTimeRange.ending_now
    end
  end
end
