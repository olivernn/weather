# Weather

A D3 visualization of the temperature in the UK using data from the [Met Office](http://www.metoffice.gov.uk/).

    http://uk.temperature.at

## Installation

This is a simple Rails app and the following steps should get the app running locally.

    cp config/database.yml.example config/database.yml
    bundle
    bundle exec rake db:schema:load
    foreman start

Data cab be collected by using the `rake met_office_import` command.

## Met Office Api Key

To collect data from the Met Office API you need to [sign up for an API key](http://www.metoffice.gov.uk/datapoint/support/API) and place it in the `MET_OFFICE_API_KEY` environment variable.
