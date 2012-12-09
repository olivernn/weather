require 'net/http'
require 'uri'
require 'json'

module MetOfficeApi
  extend self

  class MissingApiKeyError < StandardError ; end

  HOST = 'datapoint.metoffice.gov.uk'
  PATH = '/public/data/val/wxobs/all/json/all'
  API_KEY = ENV['MET_OFFICE_API_KEY']

  def observations
    raise MissingApiKeyError unless API_KEY.present?
    response = Net::HTTP.get_response(url)
    JSON.parse(response.body)
  end

  private

  def url
    URI::HTTP.build(host: HOST, path: PATH, query: params.to_query)
  end

  def params
    {
      res: 'hourly',
      key: API_KEY
    }
  end
end
