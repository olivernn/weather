class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.integer :ref
      t.float :lat
      t.float :lng
      t.string :name
      t.string :country
      t.string :continent
      t.timestamps
    end

    add_index :locations, :ref
  end
end
