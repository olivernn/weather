class CreateObservations < ActiveRecord::Migration
  def change
    create_table :observations do |t|
      t.integer :location_id
      t.datetime :date
      t.integer :wind_gust
      t.float :temperature
      t.integer :visibility
      t.string :wind_direction
      t.integer :wind_speed
      t.string :weather_type
      t.integer :pressure
      t.timestamps
    end

    add_index :observations, [:location_id, :date]
  end
end
