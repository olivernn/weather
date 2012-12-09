require 'met_office_api'

module DailyImporter
  extend self

  def run!
    location_observations_data.each do |raw_location|
      location_attrs = LocationMapper.new(raw_location).to_h
      location = Location.find_or_create_by_ref(location_attrs[:ref], location_attrs)

      ObservationsMapper.new(raw_location).to_a.each do |observation_attrs|
        observation = location.observations.find_or_create_by_date(observation_attrs[:date], observation_attrs)
        Rails.logger.info "imported #{location.name} observation for #{observation.date}"
      end
    end
  end

  private

  def location_observations_data
    @location_observations ||= MetOfficeApi.observations["SiteRep"]["DV"]["Location"]
  end
end
