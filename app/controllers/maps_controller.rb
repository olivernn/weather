class MapsController < ApplicationController
  def show
    @start_date = 2.weeks.ago
  end
end
