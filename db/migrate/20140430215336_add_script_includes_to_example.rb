class AddScriptIncludesToExample < ActiveRecord::Migration
  def change
    add_column :examples, :script_header, :text
  end
end


