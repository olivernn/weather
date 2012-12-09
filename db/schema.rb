# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121209002004) do

  create_table "locations", :force => true do |t|
    t.integer  "ref"
    t.float    "lat"
    t.float    "lng"
    t.string   "name"
    t.string   "country"
    t.string   "continent"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "locations", ["ref"], :name => "index_locations_on_ref"

  create_table "observations", :force => true do |t|
    t.integer  "location_id"
    t.datetime "date"
    t.integer  "wind_gust"
    t.float    "temperature"
    t.integer  "visibility"
    t.string   "wind_direction"
    t.integer  "wind_speed"
    t.string   "weather_type"
    t.integer  "pressure"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "observations", ["location_id", "date"], :name => "index_observations_on_location_id_and_date"

end
