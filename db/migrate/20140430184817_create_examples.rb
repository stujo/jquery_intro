class CreateExamples < ActiveRecord::Migration
  def change
    create_table :examples do |t|
      t.string :name
      t.integer :number
      t.string :template_name
      t.string :description
      t.references :chapter, index: true

      t.timestamps
    end
  end
end
