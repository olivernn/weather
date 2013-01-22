class AddDateIndexToObservation < ActiveRecord::Migration
  def change
    add_index :observations, :date
  end
end
