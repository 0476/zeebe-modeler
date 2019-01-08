/* global sinon */

import React from 'react';

import { mount } from 'enzyme';

import {
  Cache,
  WithCachedState
} from '../../../cached';

import {
  ZeebeEditor
} from '../ZeebeEditor';

import BpmnModeler from 'test/mocks/bpmn-js/Modeler';

import { SlotFillRoot } from 'src/app/slot-fill';

import diagramXML from './diagram.bpmn';

const { spy } = sinon;


describe('<ZeebeEditor>', function() {

  it('should render', function() {
    const {
      instance
    } = renderEditor(diagramXML);

    expect(instance).to.exist;
  });


  describe('caching behavior', function() {

    let createSpy;

    beforeEach(function() {
      createSpy = sinon.spy(ZeebeEditor, 'createCachedState');
    });

    afterEach(function() {
      createSpy.restore();
    });


    it('should create modeler if not cached', function() {

      // when
      const {
        instance
      } = renderEditor(diagramXML);

      // then
      const {
        modeler
      } = instance.getCached();

      expect(modeler).to.exist;
      expect(createSpy).to.have.been.calledOnce;
    });


    it('should use cached modeler', function() {

      // given
      const cache = new Cache();

      cache.add('editor', {
        cached: {
          modeler: new BpmnModeler()
        },
        __destroy: () => {}
      });

      // when
      renderEditor(diagramXML, {
        id: 'editor',
        cache
      });

      // then
      expect(createSpy).not.to.have.been.called;
    });

  });


  it('#getXML', async function() {

    // given
    let instance;

    async function onImport() {

      // when
      const xml = await instance.getXML();

      // then
      expect(xml).to.exist;
      expect(xml).to.eql(diagramXML);
    }

    instance = renderEditor(diagramXML, {
      onImport
    }).instance;
  });


  describe('#exportAs', function() {

    // increase test time-outs, as exporting takes a
    // long certain underpowered CI systems (AppVeyor, wink, wink)
    this.timeout(5000);

    let instance;

    beforeEach(function() {
      instance = renderEditor(diagramXML).instance;
    });


    it('svg', async function() {
      const contents = await instance.exportAs('svg');

      expect(contents).to.exist;
      expect(contents).to.equal('<svg />');
    });


    it('png', async function() {
      const contents = await instance.exportAs('png');

      expect(contents).to.exist;
      expect(contents).to.contain('data:image/png');
    });


    it('jpeg', async function() {
      const contents = await instance.exportAs('jpeg');

      expect(contents).to.exist;
      expect(contents).to.contain('data:image/jpeg');
    });

  });


  describe('#handleChanged', function() {

    it('should notify about changes', function() {

      // given
      const changedSpy = (state) => {

        // then
        expect(state).to.include({
          align: false,
          copy: false,
          distribute: false,
          editLabel: false,
          find: true,
          globalConnectTool: true,
          handTool: true,
          lassoTool: true,
          moveCanvas: true,
          moveToOrigin: true,
          paste: false,
          redo: true,
          removeSelected: false,
          setColor: false,
          spaceTool: true,
          undo: true
        });
      };

      const cache = new Cache();

      cache.add('editor', {
        cached: {
          modeler: new BpmnModeler({
            clipboard: {
              isEmpty: () => true
            },
            commandStack: {
              canRedo: () => true,
              canUndo: () => true
            },
            selection: {
              get: () => []
            }
          })
        },
        __destroy: () => {}
      });

      const { instance } = renderEditor(diagramXML, {
        id: 'editor',
        cache,
        onChanged: changedSpy
      });

      // when
      instance.handleChanged();
    });

  });


  describe('layout', function() {

    it('should open properties panel', function() {

      // given
      let layout = {
        propertiesPanel: {
          open: false
        }
      };

      function onLayoutChanged(newLayout) {
        layout = newLayout;
      }

      const {
        wrapper
      } = renderEditor(diagramXML, {
        layout,
        onLayoutChanged
      });

      const toggle = wrapper.find('.toggle');

      // when
      toggle.simulate('click');

      // then
      expect(layout.propertiesPanel.open).to.be.true;
    });


    it('should close properties panel', function() {

      // given
      let layout = {
        propertiesPanel: {
          open: true
        }
      };

      function onLayoutChanged(newLayout) {
        layout = newLayout;
      }

      const {
        wrapper
      } = renderEditor(diagramXML, {
        layout,
        onLayoutChanged
      });

      const toggle = wrapper.find('.toggle');

      // when
      toggle.simulate('click');

      // then
      expect(layout.propertiesPanel.open).to.be.false;
    });


    it('should handle missing layout', function() {

      // given
      let layout = { };

      // then
      renderEditor(diagramXML, {
        layout
      });

    });

  });


  describe('errors', function() {

    // TODO
    it('should handle template error');


    it('should handle XML export error', async function() {

      // given
      let instance;

      const errorSpy = spy();

      async function onImport() {

        // when
        let err;

        try {
          await instance.getXML();
        } catch (e) {
          err = e;
        }

        // then
        expect(err).to.exist;
        expect(errorSpy).to.have.been.calledOnce;
      }

      instance = renderEditor('export-error', {
        onError: errorSpy,
        onImport
      }).instance;
    });


    it('should handle image export error', async function() {

      // given
      let instance;

      const errorSpy = spy();

      async function onImport() {

        // when
        let err;

        try {
          await instance.exportAs('svg');
        } catch (e) {
          err = e;
        }

        // then
        expect(err).to.exist;
        expect(errorSpy).to.have.been.calledOnce;
      }

      instance = renderEditor('export-as-error', {
        onError: errorSpy,
        onImport
      }).instance;
    });

  });


  describe('import', function() {

    it('should import without errors and warnings', function() {

      // given
      let instance;

      function onImport(err, warnings) {

        // then
        const {
          modeler
        } = instance.getCached();

        expect(modeler.lastXML).to.equal(diagramXML);

        expect(err).to.not.exist;

        expect(warnings).to.have.length(0);
      }

      // when
      instance = renderEditor(diagramXML, {
        onImport
      }).instance;
    });


    it('should import with warnings', function() {

      // given
      let instance;

      function onImport(error, warnings) {

        // then
        const {
          modeler
        } = instance.getCached();

        expect(modeler.lastXML).to.equal('import-warnings');

        expect(error).not.to.exist;

        expect(warnings).to.have.length(1);
        expect(warnings[0]).to.equal('warning');
      }

      // when
      instance = renderEditor('import-warnings', {
        onImport
      }).instance;
    });


    it('should import with error', function() {

      // given
      let instance;

      function onImport(error, warnings) {

        // then
        const {
          modeler
        } = instance.getCached();

        expect(modeler.lastXML).not.to.exist;

        expect(error).to.exist;
        expect(error.message).to.equal('error');

        expect(warnings).to.have.length(0);
      }

      // when
      instance = renderEditor('import-error', {
        onImport
      }).instance;
    });

  });


  describe('editor resize', function() {

    afterEach(sinon.restore);


    it('should resize editor and properties panel on layout change', async function() {

      // given
      const eventBusStub = sinon.stub({ fire() {} }),
            canvasStub = sinon.stub({ resized() {} });

      const cache = new Cache();

      cache.add('editor', {
        cached: {
          modeler: new CmmnModeler({
            eventBus: eventBusStub,
            canvas: canvasStub
          })
        }
      });

      const {
        instance
      } = await renderEditor(diagramXML, {
        cache
      });

      const mockLayout = {
        propertiesPanel: {
          open: true,
          width: 500
        }
      };

      eventBusStub.fire.resetHistory();
      canvasStub.resized.resetHistory();

      // when
      const prevProps = instance.props;

      instance.props = { ...prevProps, layout: mockLayout };
      instance.componentDidUpdate(prevProps);

      // expect
      expect(canvasStub.resized).to.be.called;
      expect(eventBusStub.fire).to.be.calledOnceWith('propertiesPanel.resized');
    });

  });

});


// helpers //////////

function noop() {}

const TestEditor = WithCachedState(ZeebeEditor);

function renderEditor(xml, options = {}) {
  const {
    id,
    layout,
    onAction,
    onChanged,
    onContentUpdated,
    onError,
    onImport,
    onLayoutChanged,
    onModal
  } = options;

  const slotFillRoot = mount(
    <SlotFillRoot>
      <TestEditor
        id={ id || 'editor' }
        xml={ xml }
        onAction={ onAction || noop }
        onChanged={ onChanged || noop }
        onError={ onError || noop }
        onImport={ onImport || noop }
        onLayoutChanged={ onLayoutChanged || noop }
        onContentUpdated={ onContentUpdated || noop }
        onModal={ onModal || noop }
        cache={ options.cache || new Cache() }
        layout={ layout || {
          minimap: {
            open: false
          },
          propertiesPanel: {
            open: true
          }
        } }
      />
    </SlotFillRoot>
  );

  const wrapper = slotFillRoot.find(ZeebeEditor);

  const instance = wrapper.instance();

  return {
    instance,
    wrapper
  };
}